import { Module } from '@nestjs/common';
import { ActualiteCategoryController } from './actualite-category.controller';
import { ActualiteCategoryService } from './actualite-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActualiteCategory } from './entities/actualite-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActualiteCategory]),
  ],
  controllers: [ActualiteCategoryController],
  providers: [ActualiteCategoryService],
  exports: [ActualiteCategoryService],
})
export class ActualiteCategoryModule {}
