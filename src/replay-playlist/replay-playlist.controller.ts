import {
  BadRequestException,
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
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReplayPlaylistService } from './replay-playlist.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReplayPlaylistDto } from './dto/create-replay-playlist.dto';
import { ReplayPlaylist } from './entities/replay-playlist.entity';
import { UpdateReplayPlaylistDto } from './dto/update-replay-playlist.dto';
import { DeleteResult } from 'typeorm';

@Controller('replay-playlist')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('Replay Playlist')
export class ReplayPlaylistController {
  constructor(private readonly replayPlaylistService: ReplayPlaylistService) {}

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
  @ApiOperation({ summary: 'Create a new replay playlist' })
  @ApiBody({ type: CreateReplayPlaylistDto })
  async create(
    @Body() payload: CreateReplayPlaylistDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ReplayPlaylist> {
    return this.replayPlaylistService.create(payload, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all replay playlists' })
  async findAll(): Promise<ReplayPlaylist[]> {
    return this.replayPlaylistService.findAll();
  }

  @Get('one')
  @ApiOperation({ summary: 'Get a replay playlist by ID' })
  async getOne(@Param('id') id: string): Promise<ReplayPlaylist> {
    return this.replayPlaylistService.getOne(id);
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
  @ApiOperation({ summary: 'Update a replay playlist' })
  @ApiBody({ type: UpdateReplayPlaylistDto })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateReplayPlaylistDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.replayPlaylistService.update(id, payload, file);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete a replay playlist' })
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.replayPlaylistService.delete(id);
  }

  async getPlaylistById(id: string): Promise<ReplayPlaylist> {
    return this.replayPlaylistService.getOne(id);
  }
}
