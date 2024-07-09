import { Module } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';
import { ProgrammesController } from './programmes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from './entities/programme.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Programme]),
    MulterModule.register({ dest: './uploads/programmes' }),
  ],
  providers: [ProgrammesService],
  controllers: [ProgrammesController],
  exports: [ProgrammesService],
})
export class ProgrammesModule {}
