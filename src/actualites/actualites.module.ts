import { Module } from '@nestjs/common';
import { ActualitesController } from './actualites.controller';
import { ActualitesService } from './actualites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actualites } from './entities/actualites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actualites]),
  ],
  controllers: [ActualitesController],
  providers: [ActualitesService],
  exports: [ActualitesService],
})
export class ActualitesModule {}
