import { Test, TestingModule } from '@nestjs/testing';
import { GarageController } from './garage.controller';

describe('GarageController', () => {
  let controller: GarageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GarageController],
    }).compile();

    controller = module.get<GarageController>(GarageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
