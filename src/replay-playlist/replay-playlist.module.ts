import { Module } from '@nestjs/common';
import { ReplayPlaylistController } from './replay-playlist.controller';
import { ReplayPlaylistService } from './replay-playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplayPlaylist } from './entities/replay-playlist.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ReplayPlaylist]), ConfigModule],
  controllers: [ReplayPlaylistController],
  providers: [ReplayPlaylistService],
  exports: [ReplayPlaylistService],
})
export class ReplayPlaylistModule {}
