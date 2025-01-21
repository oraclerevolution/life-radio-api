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
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProgrammesModule } from './programmes/programmes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-csqfp28gph6c73ebfs4g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'liferadio_gxtt_user',
      password: 'WAzGrdxYNG27cVWOw0BtsiqJ08HgTTiy',
      database: 'liferadio_gxtt',
      entities: ['dist/**/*.entity{.ts,.js}'],
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: '/opt/render/project/uploads',
      serveRoot: '/uploads',
    }),
    ActualitesModule,
    HelperModule,
    ActualiteCategoryModule,
    PodcastsPlaylistModule,
    PodcastsModule,
    LiveModule,
    VideosModule,
    ReplayModule,
    ReplayPlaylistModule,
    ProgrammesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
