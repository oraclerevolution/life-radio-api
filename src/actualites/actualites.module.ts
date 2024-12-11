import { Module } from '@nestjs/common';
import { ActualitesController } from './actualites.controller';
import { ActualitesService } from './actualites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actualites } from './entities/actualites.entity';
import { ActualiteCategoryModule } from 'src/actualite-category/actualite-category.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actualites]),
    ActualiteCategoryModule,
    MulterModule.register({
      dest: './uploads/actualites',
      preservePath: true,
    }),
    ConfigModule,
  ],
  controllers: [ActualitesController],
  providers: [ActualitesService],
  exports: [ActualitesService],
})
export class ActualitesModule {}
