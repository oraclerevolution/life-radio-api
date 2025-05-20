import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PodcastsPlaylistService } from 'src/podcasts-playlist/podcasts-playlist.service';
import { Repository, UpdateResult } from 'typeorm';
import { Podcasts } from './entities/podcast.entity';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import getAudioDurationInSeconds from 'get-audio-duration';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcasts)
    private readonly repository: Repository<Podcasts>,
    private readonly podcastPlaylistService: PodcastsPlaylistService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Retrieves all podcasts that belong to a specific playlist.
   *
   * @param {string} id - The id of the playlist to filter the podcasts by.
   * @return {Promise<Podcasts[]>} A list of podcasts that belong to the specified playlist.
   */
  async findAll(id: string): Promise<Podcasts[]> {
    return this.repository.find({
      where: { playlist: { id: id }, status: true },
      relations: ['playlist'],
    });
  }

  /**
   * Retrieves a single podcast by its ID with related playlist information.
   *
   * @param {string} id - The ID of the podcast to retrieve.
   * @return {Promise<Podcasts>} A promise that resolves to the retrieved podcast with playlist information.
   */
  async getOne(id: string): Promise<Podcasts> {
    return this.repository.findOne({
      where: { id, status: true },
      relations: ['playlist'],
    });
  }

  /**
   * Retrieves a podcast by its playlist ID.
   *
   * @param {string} id - The ID of the playlist to search for the podcast.
   * @return {Promise<Podcasts>} A promise that resolves to the podcast found, or null if not found.
   */
  async getPodcastByPlaylistId(id: string): Promise<Podcasts> {
    return this.repository.findOne({ where: { playlist: { id } } });
  }

  /**
   * Creates a new podcast with the given payload and file.
   *
   * @param {CreatePodcastDto} payload - The data for the new podcast.
   * @param {Express.Multer.File} file - The audio file for the podcast.
   * @return {Promise<Podcasts>} A promise that resolves to the created podcast.
   */
  async create(
    payload: CreatePodcastDto,
    file: Express.Multer.File,
  ): Promise<Podcasts> {
    const { playlistId, titre } = payload;

    const supabaseConfig = {
      SUPABASE_API_KEY: this.configService.get<string>('SUPABASE_API_KEY'),
      SUPABASE_PROJECT_URL: this.configService.get<string>(
        'SUPABASE_PROJECT_URL',
      ),
      SUPABASE_BUCKET_NAME: this.configService.get<string>(
        'SUPABASE_BUCKET_NAME',
      ),
      BASE_URL_IMAGE: this.configService.get<string>('BASE_URL_IMAGE'),
    };

    const supabase = createClient(
      supabaseConfig.SUPABASE_PROJECT_URL,
      supabaseConfig.SUPABASE_API_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const playlist = await this.podcastPlaylistService.getOne(playlistId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const fileName = `podcast-${uuidv4()}.${file.mimetype.split('/').pop()}`;
    const filePath = `${fileName}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from(supabaseConfig.SUPABASE_BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      throw error;
    }
    const { data: publicUrl } = supabase.storage
      .from(supabaseConfig.SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName);
    const duration = await getAudioDurationInSeconds(file.path);

    const podcast = new Podcasts();
    podcast.playlist = playlist;
    podcast.titre = titre;
    podcast.image = playlist.image;
    podcast.duration = duration.toString();
    podcast.audio = publicUrl.publicUrl;

    return this.repository.save(podcast);
  }

  /**
   * Updates a podcast with the given ID and payload.
   *
   * @param {string} id - The ID of the podcast to update.
   * @param {UpdatePodcastDto} payload - The data to update the podcast with.
   * @param {Express.Multer.File} file - The audio file for the podcast.
   * @return {Promise<UpdateResult>} A promise that resolves to the result of the update operation.
   * @throws {NotFoundException} If the podcast with the given ID is not found.
   */
  async update(
    id: string,
    payload: UpdatePodcastDto,
    file: Express.Multer.File,
  ): Promise<Podcasts> {
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

    const existingPodcast = await this.getOne(id);
    if (!existingPodcast) {
      throw new NotFoundException("Le podcast n'existe pas");
    }

    if (
      payload.playlistId &&
      payload.playlistId !== existingPodcast.playlist.id
    ) {
      const newPlaylist = await this.podcastPlaylistService.getOne(
        payload.playlistId,
      );
      if (!newPlaylist) {
        throw new NotFoundException("La playlist n'existe pas");
      }
      existingPodcast.playlist = newPlaylist;
    }

    if (file) {
      const fileName = `podcast-${uuidv4()}.${file.mimetype.split('/').pop()}`;
      const { error } = await supabase.storage
        .from(supabaseConfig.bucketName)
        .upload(fileName, file.buffer, { contentType: file.mimetype });
      if (error) {
        throw error;
      }
      const { data: publicUrl } = supabase.storage
        .from(supabaseConfig.bucketName)
        .getPublicUrl(fileName);

      existingPodcast.audio = publicUrl.publicUrl;
      existingPodcast.duration = (
        await getAudioDurationInSeconds(file.path)
      ).toString();
    }

    if (payload.titre && payload.titre !== existingPodcast.titre) {
      existingPodcast.titre = payload.titre;
    }

    return this.repository.save(existingPodcast);
  }

  /**
   * Deletes a record from the repository based on the provided id.
   *
   * @param {string} id - The identifier of the record to delete.
   * @return {Promise<DeleteResult>} The result of the deletion operation.
   */
  async delete(id: string): Promise<UpdateResult> {
    const podcast = await this.getOne(id);
    return await this.repository.update(podcast.id, { status: false });
  }
}
