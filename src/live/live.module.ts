import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveUrl } from './entities/live-url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LiveUrl])],
  controllers: [LiveController],
  providers: [LiveService],
})
export class LiveModule {}
