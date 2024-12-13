import { Module } from '@nestjs/common';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';
import { Podcasts } from './entities/podcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PodcastsPlaylistModule } from 'src/podcasts-playlist/podcasts-playlist.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Podcasts]),
    MulterModule.register({
      dest: './uploads/podcasts',
    }),
    PodcastsPlaylistModule,
    ConfigModule,
  ],
  controllers: [PodcastsController],
  providers: [PodcastsService],
})
export class PodcastsModule {}
