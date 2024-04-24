import { Module } from '@nestjs/common';
import { ReplayPlaylistController } from './replay-playlist.controller';
import { ReplayPlaylistService } from './replay-playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplayPlaylist } from './entities/replay-playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReplayPlaylist])],
  controllers: [ReplayPlaylistController],
  providers: [ReplayPlaylistService],
})
export class ReplayPlaylistModule {}
