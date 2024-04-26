import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActualitesModule } from './actualites/actualites.module';
import { HelperModule } from './helper/helper.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActualiteCategoryModule } from './actualite-category/actualite-category.module';
import { PodcastsPlaylistModule } from './podcasts-playlist/podcasts-playlist.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { LiveModule } from './live/live.module';
import { VideosModule } from './videos/videos.module';
import { ReplayModule } from './replay/replay.module';
import { ReplayPlaylistModule } from './replay-playlist/replay-playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ActualitesModule, 
    HelperModule, ActualiteCategoryModule, PodcastsPlaylistModule, PodcastsModule, LiveModule, VideosModule, ReplayModule, ReplayPlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
