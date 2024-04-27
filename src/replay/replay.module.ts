import { Module } from '@nestjs/common';
import { ReplayController } from './replay.controller';
import { ReplayService } from './replay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Replay } from './entities/replay.entity';
import { ReplayPlaylistModule } from 'src/replay-playlist/replay-playlist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Replay]), ReplayPlaylistModule],
  controllers: [ReplayController],
  providers: [ReplayService],
})
export class ReplayModule {}
