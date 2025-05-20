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
import { ReplayService } from './replay.service';
import { Replay } from './entities/replay.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReplayDto } from './dto/create-replay.dto';
import { UpdateReplayDto } from './dto/update-replay.dto';
import { DeleteResult } from 'typeorm';

@Controller('replay')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('Replays')
export class ReplayController {
  constructor(private readonly replayService: ReplayService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all replay of a playlist' })
  async findAll(@Param('id_playlist') id: string): Promise<Replay[]> {
    return this.replayService.findAll(id);
  }

  @Get('one')
  @ApiOperation({ summary: 'Get replay by id' })
  async getOne(@Param('id') id: string): Promise<Replay> {
    return this.replayService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a replay to a playlist' })
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
    @Body() payload: CreateReplayDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.replayService.create(payload, file);
  }

  @Patch('update-replay')
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
  @ApiOperation({ summary: 'Update replay by id' })
  @ApiBody({ type: UpdateReplayDto })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateReplayDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.replayService.update(id, payload, file);
  }

  @Delete('delete-replay')
  @ApiOperation({ summary: 'Delete podcast by id' })
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.replayService.delete(id);
  }
}
