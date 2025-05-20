import { Injectable, NotFoundException } from '@nestjs/common';
import { PodcastsPlaylist } from './entities/podcasts-playlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PodcastsPlaylistService {
  constructor(
    @InjectRepository(PodcastsPlaylist)
    private readonly repository: Repository<PodcastsPlaylist>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Retrieves all podcasts playlists from the repository.
   *
   * @return {Promise<PodcastsPlaylist[]>} The list of all podcasts playlists.
   */
  async findAll(): Promise<PodcastsPlaylist[]> {
    return this.repository.find({
      where: {
        status: true,
      },
    });
  }

  /**
   * Retrieves a single podcast playlist by its ID.
   *
   * @param {string} id - The ID of the podcast playlist to retrieve.
   * @return {Promise<PodcastsPlaylist>} A promise that resolves to the retrieved podcast playlist.
   */
  async getOne(id: string): Promise<PodcastsPlaylist> {
    return this.repository.findOne({ where: { id, status: true } });
  }

  /**
   * Saves a new podcasts playlist to the repository.
   *
   * @param {CreatePlaylistDto} payload - The data for the new playlist.
   * @return {Promise<PodcastsPlaylist>} The saved podcasts playlist.
   */
  async create(
    payload: CreatePlaylistDto,
    file: Express.Multer.File,
  ): Promise<PodcastsPlaylist> {
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

    const fileName = `podcast-playlist-${uuidv4()}.${file.mimetype.split('/').pop()}`;
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

    const podcast = new PodcastsPlaylist();
    podcast.name = payload.name;
    podcast.image = publicUrl.publicUrl;
    return this.repository.save(podcast);
  }

  /**
   * Updates a podcast playlist with the given ID and payload.
   *
   * @param {string} id - The ID of the playlist to update.
   * @param {UpdatePlaylistDto} payload - The data to update the playlist with.
   * @return {Promise<PodcastsPlaylist>} A promise that resolves to the updated playlist.
   */
  async update(
    id: string,
    payload: UpdatePlaylistDto,
    file: Express.Multer.File,
  ): Promise<PodcastsPlaylist> {
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

    const existingPodcastPlaylist = await this.getOne(id);
    if (!existingPodcastPlaylist) {
      throw new NotFoundException("La playlist n'existe pas");
    }

    if (payload.name && payload.name !== existingPodcastPlaylist.name) {
      existingPodcastPlaylist.name = payload.name;
    }

    if (file) {
      const fileName = `podcast-playlist-${uuidv4()}.${file.mimetype.split('/').pop()}`;
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
      existingPodcastPlaylist.image = publicUrl.publicUrl;
    }

    return this.repository.save(existingPodcastPlaylist);
  }

  /**
   * Deletes a record from the repository based on the provided id.
   *
   * @param {string} id - The identifier of the record to delete.
   * @return {Promise<DeleteResult>} The result of the deletion operation.
   */
  async delete(id: string): Promise<DeleteResult> {
    const playlist = await this.getOne(id);
    return await this.repository.update(playlist.id, { status: false });
  }
}
