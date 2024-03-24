import { Test, TestingModule } from '@nestjs/testing';
import { ActualitesController } from './actualites.controller';

describe('ActualitesController', () => {
  let controller: ActualitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActualitesController],
    }).compile();

    controller = module.get<ActualitesController>(ActualitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
