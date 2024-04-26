import { Module } from '@nestjs/common';
import { ReplayController } from './replay.controller';
import { ReplayService } from './replay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Replay } from './entities/replay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Replay])],
  controllers: [ReplayController],
  providers: [ReplayService],
})
export class ReplayModule {}
