import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Podcasts } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Controller('podcasts')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('Podcasts')
export class PodcastsController {
  constructor(private readonly podcastService: PodcastsService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all podcasts of a playlist' })
  async findAll(@Query('id_playlist') id: string): Promise<Podcasts[]> {
    return this.podcastService.findAll(id);
  }

  @Get('one')
  @ApiOperation({ summary: 'Get podcast by id' })
  async getOne(@Param('id') id: string): Promise<Podcasts> {
    return this.podcastService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a podcast to playlist' })
  @UseInterceptors(
    FileInterceptor('audio', {
      fileFilter: (req, file, cb) => {
        if (
          ['audio/mp3', 'audio/mpeg', 'video/mp4'].includes(file.mimetype) &&
          file.size <= 6000000
        ) {
          cb(null, true);
        } else if (
          !['audio/mp3', 'audio/mpeg', 'video/mp4'].includes(file.mimetype)
        ) {
          cb(
            new BadRequestException('Only mp3 and mp4 files are allowed'),
            false,
          );
        } else {
          cb(
            new BadRequestException(
              'File size exceeds the maximum limit of 6MB',
            ),
            false,
          );
        }
      },
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
      fileFilter: (req, file, cb) => {
        if (
          ['audio/mp3', 'audio/mpeg', 'video/mp4'].includes(file.mimetype) &&
          file.size <= 6000000
        ) {
          cb(null, true);
        } else if (
          !['audio/mp3', 'audio/mpeg', 'video/mp4'].includes(file.mimetype)
        ) {
          cb(
            new BadRequestException('Only mp3 and mp4 files are allowed'),
            false,
          );
        } else {
          cb(
            new BadRequestException(
              'File size exceeds the maximum limit of 6MB',
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Update podcast by id' })
  @ApiBody({ type: UpdatePodcastDto })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePodcastDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.podcastService.update(id, payload, file);
  }

  // @Delete('delete-podcast')
  // @ApiOperation({ summary: 'Delete podcast by id' })
  // async delete(@Param('id') id: string): Promise<DeleteResult> {
  //   return await this.podcastService.delete(id);
  // }
}
