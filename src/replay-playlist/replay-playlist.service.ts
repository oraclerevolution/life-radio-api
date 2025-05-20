import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplayPlaylist } from './entities/replay-playlist.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateReplayPlaylistDto } from './dto/create-replay-playlist.dto';
import { UpdateReplayPlaylistDto } from './dto/update-replay-playlist.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

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
    const { name } = payload;

    const supabaseConfig = {
      apiKey: this.configService.get<string>('SUPABASE_API_KEY'),
      projectUrl: this.configService.get<string>('SUPABASE_PROJECT_URL'),
      bucketName: this.configService.get<string>('SUPABASE_BUCKET_NAME'),
      baseUrlImage: this.configService.get<string>('BASE_URL_IMAGE'),
    };

    const supabase = createClient(
      supabaseConfig.projectUrl,
      supabaseConfig.apiKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Construire le lien de l'image
    const fileName = `replay-playlist-${uuidv4()}.${file.mimetype.split('/').pop()}`;
    const filePath = `${fileName}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from(supabaseConfig.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      throw error;
    }
    const { data: publicUrl } = supabase.storage
      .from(supabaseConfig.bucketName)
      .getPublicUrl(fileName);

    const replay_playlist = new ReplayPlaylist();
    replay_playlist.name = name;
    replay_playlist.image = publicUrl.publicUrl;

    return this.repository.save(replay_playlist);
  }

  async update(
    id: string,
    payload: UpdateReplayPlaylistDto,
    file?: Express.Multer.File,
  ): Promise<ReplayPlaylist> {
    const supabaseConfig = {
      apiKey: this.configService.get<string>('SUPABASE_API_KEY'),
      projectUrl: this.configService.get<string>('SUPABASE_PROJECT_URL'),
      bucketName: this.configService.get<string>('SUPABASE_BUCKET_NAME'),
      baseUrlImage: this.configService.get<string>('BASE_URL_IMAGE'),
    };

    const supabase = createClient(
      supabaseConfig.projectUrl,
      supabaseConfig.apiKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const existingReplayPlaylist = await this.getOne(id);

    if (!existingReplayPlaylist) {
      throw new Error("La playlist n'existe pas");
    }

    if (payload.name && payload.name !== existingReplayPlaylist.name) {
      existingReplayPlaylist.name = payload.name;
    }

    if (file) {
      const fileName = `replay-playlist-${uuidv4()}.${file.mimetype.split('/').pop()}`;
      const filePath = `${fileName}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.storage
        .from(supabaseConfig.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });
      if (error) {
        throw error;
      }
      const { data: publicUrl } = supabase.storage
        .from(supabaseConfig.bucketName)
        .getPublicUrl(fileName);
      existingReplayPlaylist.image = publicUrl.publicUrl;
    }

    return this.repository.save(existingReplayPlaylist);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}
