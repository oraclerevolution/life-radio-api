import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplayPlaylist } from './entities/replay-playlist.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateReplayPlaylistDto } from './dto/create-replay-playlist.dto';
import { UpdateReplayPlaylistDto } from './dto/update-replay-playlist.dto';

@Injectable()
export class ReplayPlaylistService {
  constructor(
    @InjectRepository(ReplayPlaylist)
    private readonly repository: Repository<ReplayPlaylist>,
  ) {}

  async findAll(): Promise<ReplayPlaylist[]> {
    return this.repository.find();
  }

  async getOne(id: string): Promise<ReplayPlaylist> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async create(
    payload: CreateReplayPlaylistDto,
    file: Express.Multer.File,
  ): Promise<ReplayPlaylist> {
    const newFilename = `${file.originalname.trim()}`;
    payload.image = newFilename;
    return this.repository.save(payload);
  }

  async update(
    id: string,
    payload: UpdateReplayPlaylistDto,
    file: Express.Multer.File,
  ): Promise<ReplayPlaylist> {
    const newFilename = `${file.originalname.trim()}`;
    if (payload.image) {
      payload.image = newFilename;
    }
    return this.repository.save({ id, ...payload });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}
