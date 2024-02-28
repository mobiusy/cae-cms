import { Test, TestingModule } from '@nestjs/testing';
import { BaseLibService } from './base-lib.service';

describe('BaseLibService', () => {
  let service: BaseLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseLibService],
    }).compile();

    service = module.get<BaseLibService>(BaseLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
