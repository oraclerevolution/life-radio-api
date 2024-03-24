import { Test, TestingModule } from '@nestjs/testing';
import { ActualiteCategoryService } from './actualite-category.service';

describe('ActualiteCategoryService', () => {
  let service: ActualiteCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActualiteCategoryService],
    }).compile();

    service = module.get<ActualiteCategoryService>(ActualiteCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
