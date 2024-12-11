import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplayPlaylist } from './entities/replay-playlist.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateReplayPlaylistDto } from './dto/create-replay-playlist.dto';
import { UpdateReplayPlaylistDto } from './dto/update-replay-playlist.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReplayPlaylistService {
  constructor(
    @InjectRepository(ReplayPlaylist)
    private readonly repository: Repository<ReplayPlaylist>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<ReplayPlaylist[]> {
    return this.repository.find({
      where: {
        status: true,
      },
    });
  }

  async getOne(id: string): Promise<ReplayPlaylist> {
    return this.repository.findOne({
      where: {
        id,
        status: true,
      },
    });
  }

  async create(
    payload: CreateReplayPlaylistDto,
    file: Express.Multer.File,
  ): Promise<ReplayPlaylist> {
    // Construire le lien de l'image
    const baseUrl = this.configService.get<string>('BASE_URL'); // URL de base de l'API
    const imageUrl = `${baseUrl}/uploads/replay/playlists/${uuidv4()}-${file.originalname.toLowerCase().trim()}`;
    payload.image = imageUrl;
    return this.repository.save(payload);
  }

  async update(
    id: string,
    payload: UpdateReplayPlaylistDto,
    file: Express.Multer.File,
  ): Promise<ReplayPlaylist> {
    if (payload.image) {
      const baseUrl = this.configService.get<string>('BASE_URL'); // URL de base de l'API
      const imageUrl = `${baseUrl}/uploads/replay/playlists/${uuidv4()}-${file.originalname.toLowerCase().trim()}`;
      payload.image = imageUrl;
    }
    return this.repository.save({ id, ...payload });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}
