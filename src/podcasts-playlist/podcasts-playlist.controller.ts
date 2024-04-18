import {
  Body,
  Controller,
  Delete,
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
import { diskStorage } from 'multer';
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
      storage: diskStorage({
        destination: './uploads/playlists',
        filename: (req, file, cb) => {
          const newFilename = `${file.originalname.trim()}`;
          cb(null, newFilename);
        },
      }),
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a podcast playlist by ID' })
  async getOne(@Param('id') id: string): Promise<PodcastsPlaylist> {
    return this.podcastService.getOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/playlists',
        filename: (req, file, cb) => {
          const newFilename = `${file.originalname.trim()}`;
          cb(null, newFilename);
        },
      }),
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a podcast playlist' })
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.podcastService.delete(id);
  }
}
