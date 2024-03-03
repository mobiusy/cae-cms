import { Test, TestingModule } from '@nestjs/testing';
import { StatisticController } from './statistic.controller';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
const moduleMocker = new ModuleMocker(global);

describe('StatisticController', () => {
  let controller: StatisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticController],
    })
    .useMocker((token) => {
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();

    controller = module.get<StatisticController>(StatisticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
