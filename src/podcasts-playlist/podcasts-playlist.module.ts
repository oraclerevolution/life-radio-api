import { Module } from '@nestjs/common';
import { PodcastsPlaylistController } from './podcasts-playlist.controller';
import { PodcastsPlaylistService } from './podcasts-playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastsPlaylist } from './entities/podcasts-playlist.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PodcastsPlaylist]),
    MulterModule.register({
      dest: './uploads/playlists',
    }),
    ConfigModule,
  ],
  controllers: [PodcastsPlaylistController],
  providers: [PodcastsPlaylistService],
  exports: [PodcastsPlaylistService],
})
export class PodcastsPlaylistModule {}
