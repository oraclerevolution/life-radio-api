import { Test, TestingModule } from '@nestjs/testing';
import { ActualiteCategoryController } from './actualite-category.controller';

describe('ActualiteCategoryController', () => {
  let controller: ActualiteCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActualiteCategoryController],
    }).compile();

    controller = module.get<ActualiteCategoryController>(ActualiteCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
