import { Injectable, NotFoundException } from '@nestjs/common';
import { Replay } from './entities/replay.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ReplayPlaylistService } from 'src/replay-playlist/replay-playlist.service';
import { CreateReplayDto } from './dto/create-replay.dto';
import getAudioDurationInSeconds from 'get-audio-duration';
import { UpdateReplayDto } from './dto/update-replay.dto';

@Injectable()
export class ReplayService {
  constructor(
    @InjectRepository(Replay) private readonly repository: Repository<Replay>,
    private readonly replayPlaylistService: ReplayPlaylistService,
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

    const playlist = await this.replayPlaylistService.getOne(playlistId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const duration = await getAudioDurationInSeconds(file.path);

    const replay = new Replay();
    replay.playlist = playlist;
    replay.titre = titre;
    replay.image = playlist.image;
    replay.duration = duration.toString();
    replay.audio = file.originalname.trim();

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
    file: Express.Multer.File,
  ) {
    const { titre } = payload;
    const replay = await this.getOne(id);
    if (!replay) {
      throw new NotFoundException('Replay not found');
    }
    replay.titre = titre;
    replay.audio = file.originalname.trim();
    replay.duration = (await getAudioDurationInSeconds(file.path)).toString();

    return this.repository.update({ id }, replay);
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
