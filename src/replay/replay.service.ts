import { Injectable, NotFoundException } from '@nestjs/common';
import { Replay } from './entities/replay.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ReplayPlaylistService } from 'src/replay-playlist/replay-playlist.service';
import { CreateReplayDto } from './dto/create-replay.dto';
import getAudioDurationInSeconds from 'get-audio-duration';
import { UpdateReplayDto } from './dto/update-replay.dto';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReplayService {
  constructor(
    @InjectRepository(Replay) private readonly repository: Repository<Replay>,
    private readonly replayPlaylistService: ReplayPlaylistService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Retrieves all Replay objects that belong to a specific playlist.
   *
   * @param {string} id - The ID of the playlist to filter the Replay objects by.
   * @return {Promise<Replay[]>} A promise that resolves to an array of Replay objects that belong to the specified playlist.
   */
  async findAll(id: string): Promise<Replay[]> {
    return this.repository.find({
      where: { playlist: { id }, status: true },
    });
  }

  /**
   * Retrieves a single replay by its ID with related playlist information.
   *
   * @param {string} id - The ID of the replay to retrieve.
   * @return {Promise<Replay>} A promise that resolves to the retrieved replay with playlist information.
   */
  async getOne(id: string): Promise<Replay> {
    return await this.repository.findOne({
      where: { id, status: true },
      relations: ['playlist'],
    });
  }

  /**
   * Retrieves a replay by its playlist ID.
   *
   * @param {string} id - The ID of the playlist.
   * @return {Promise<Replay>} A promise that resolves to the replay with the specified playlist ID.
   */
  async getReplayByPlaylistId(id: string): Promise<Replay> {
    return await this.repository.findOne({
      where: { playlist: { id }, status: true },
    });
  }

  /**
   * Creates a new replay with the given payload and file.
   *
   * @param {CreateReplayDto} payload - The data for the new replay.
   * @param {Express.Multer.File} file - The audio file for the replay.
   * @return {Promise<Replay>} A promise that resolves to the created replay.
   * @throws {NotFoundException} If the playlist with the given ID is not found.
   */
  async create(
    payload: CreateReplayDto,
    file: Express.Multer.File,
  ): Promise<Replay> {
    const { titre, playlistId } = payload;

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

    const playlist = await this.replayPlaylistService.getOne(playlistId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const fileName = `replay-${uuidv4()}.${file.mimetype.split('/').pop()}`;
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

    const replay = new Replay();
    replay.playlist = playlist;
    replay.titre = titre;
    replay.image = playlist.image;
    replay.duration = duration.toString();
    replay.audio = publicUrl.publicUrl;

    return this.repository.save(replay);
  }

  /**
   * Updates a replay with the given ID and payload.
   *
   * @param {string} id - The ID of the replay to update.
   * @param {UpdateReplayDto} payload - The data to update the replay with.
   * @param {Express.Multer.File} file - The audio file for the replay.
   * @return {Promise<void>} A promise that resolves when the replay is updated.
   * @throws {NotFoundException} If the replay with the given ID is not found.
   */
  async update(
    id: string,
    payload: UpdateReplayDto,
    file?: Express.Multer.File,
  ) {
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

    const existingReplay = await this.getOne(id);
    if (!existingReplay) {
      throw new NotFoundException("Le replay n'existe pas");
    }

    if (
      payload.playlistId &&
      payload.playlistId !== existingReplay.playlist.id
    ) {
      const newPlaylist = await this.replayPlaylistService.getOne(
        payload.playlistId,
      );
      if (!newPlaylist) {
        throw new NotFoundException("La playlist n'existe pas");
      }
      existingReplay.playlist = newPlaylist;
    }

    if (file) {
      const fileName = `replay-${uuidv4()}.${file.mimetype.split('/').pop()}`;
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
      const duration = await getAudioDurationInSeconds(file.path);
      existingReplay.duration = duration.toString();
      existingReplay.audio = publicUrl.publicUrl;
    }

    if (payload.titre && payload.titre !== existingReplay.titre) {
      existingReplay.titre = payload.titre;

      return this.repository.save(existingReplay);
    }
  }

  /**
   * Deletes a record from the repository based on the provided id.
   *
   * @param {string} id - The identifier of the record to delete.
   * @return {Promise<DeleteResult>} The result of the deletion operation.
   */
  async delete(id: string): Promise<DeleteResult> {
    const replay = await this.getOne(id);
    return await this.repository.update(replay.id, { status: false });
  }
}
