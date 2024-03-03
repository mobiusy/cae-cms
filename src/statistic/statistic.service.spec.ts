import { Test, TestingModule } from '@nestjs/testing';
import { StatisticService } from './statistic.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { FindPVResDto } from './dto/find-pv-req';
const moduleMocker = new ModuleMocker(global);

describe('StatisticService', () => {
  let service: StatisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticService],
    })
    .useMocker((token) => {
      if (token === 'default_IORedisModuleConnectionToken') {
        return {
          hincrby: jest.fn().mockResolvedValue(Promise.resolve(2)),
          hget: jest.fn().mockResolvedValue(Promise.resolve('2')),
        };
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();

    service = module.get<StatisticService>(StatisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/home PV increased to 2', async () => {
    expect(await service.incPV({ name: 'home', path: '/home'})).toEqual(2);
  })

  it('/home path pv should be 2', async () => {
    const res: FindPVResDto = {
      pv: 2
    }
    expect(await service.find('/home')).toEqual(res);
  })
});
