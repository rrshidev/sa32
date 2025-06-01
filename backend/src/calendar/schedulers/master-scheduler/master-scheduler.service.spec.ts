import { Test, TestingModule } from '@nestjs/testing';
import { MasterSchedulerService } from './master-scheduler.service';

describe('MasterSchedulerService', () => {
  let service: MasterSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterSchedulerService],
    }).compile();

    service = module.get<MasterSchedulerService>(MasterSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
