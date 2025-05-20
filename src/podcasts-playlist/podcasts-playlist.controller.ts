import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PodcastsPlaylistService } from './podcasts-playlist.service';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PodcastsPlaylist } from './entities/podcasts-playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { DeleteResult } from 'typeorm';

@Controller('podcasts-playlist')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('Podcasts Playlist')
export class PodcastsPlaylistController {
  constructor(private readonly podcastService: PodcastsPlaylistService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (
          ['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype) &&
          file.size <= 6000000
        ) {
          cb(null, true);
        } else if (
          !['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)
        ) {
          cb(
            new BadRequestException('Only jpg, jpeg and png files are allowed'),
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
  @ApiOperation({ summary: 'Create a new podcast playlist' })
  @ApiBody({ type: CreatePlaylistDto })
  async create(
    @Body() payload: CreatePlaylistDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PodcastsPlaylist> {
    return this.podcastService.create(payload, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all podcast playlists' })
  async findAll(): Promise<PodcastsPlaylist[]> {
    return this.podcastService.findAll();
  }

  @Get('one')
  @ApiOperation({ summary: 'Get a podcast playlist by ID' })
  async getOne(@Param('id') id: string): Promise<PodcastsPlaylist> {
    return this.podcastService.getOne(id);
  }

  @Patch('')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (
          ['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype) &&
          file.size <= 6000000
        ) {
          cb(null, true);
        } else if (
          !['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)
        ) {
          cb(
            new BadRequestException('Only jpg, jpeg and png files are allowed'),
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
  @ApiOperation({ summary: 'Update a podcast playlist' })
  @ApiBody({ type: UpdatePlaylistDto })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePlaylistDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.podcastService.update(id, payload, file);
  }

  @Patch('delete')
  @ApiOperation({ summary: 'Delete a podcast playlist' })
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.podcastService.delete(id);
  }

  async getPlaylistById(id: string): Promise<PodcastsPlaylist> {
    return this.podcastService.getOne(id);
  }
}
