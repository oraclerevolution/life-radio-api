import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Podcasts } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { diskStorage } from 'multer';
import { DeleteResult } from 'typeorm';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastService: PodcastsService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all podcasts of a playlist' })
  async findAll(@Query('id_playlist') id: string): Promise<Podcasts[]> {
    return this.podcastService.findAll(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get podcast by id' })
  async getOne(@Param('id') id: string): Promise<Podcasts> {
    return this.podcastService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a podcast to playlist' })
  @UseInterceptors(
    FileInterceptor('audio', {
      dest: './uploads/podcasts',
      fileFilter: (req, file, cb) => {
        if (['audio/mp3', 'audio/mpeg', 'video/mp4'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only mp3 and mp4 files are allowed'),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './uploads/podcasts',
        filename: (req, file, cb) => {
          const filename = `${file.originalname.trim()}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() payload: CreatePodcastDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.podcastService.create(payload, file);
  }

  @Patch('update-podcast')
  @UseInterceptors(
    FileInterceptor('audio', {
      dest: './uploads/podcasts',
      fileFilter: (req, file, cb) => {
        if (['audio/mp3', 'audio/mpeg', 'video/mp4'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only mp3 and mp4 files are allowed'),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './uploads/podcasts',
        filename: (req, file, cb) => {
          const filename = `${file.originalname.trim()}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Update podcast by id' })
  @ApiBody({ type: UpdatePodcastDto })
  async update(
    @Query('id') id: string,
    @Body() payload: UpdatePodcastDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.podcastService.update(id, payload, file);
  }

  @Delete('delete-podcast')
  @ApiOperation({ summary: 'Delete podcast by id' })
  async delete(@Query('id') id: string): Promise<DeleteResult> {
    return await this.podcastService.delete(id);
  }
}
