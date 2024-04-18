import { Injectable } from '@nestjs/common';
import { PodcastsPlaylist } from './entities/podcasts-playlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PodcastsPlaylistService {
  constructor(
    @InjectRepository(PodcastsPlaylist)
    private readonly repository: Repository<PodcastsPlaylist>,
  ) {}

  /**
   * Retrieves all podcasts playlists from the repository.
   *
   * @return {Promise<PodcastsPlaylist[]>} The list of all podcasts playlists.
   */
  async findAll(): Promise<PodcastsPlaylist[]> {
    return this.repository.find();
  }

  /**
   * Retrieves a single podcast playlist by its ID.
   *
   * @param {string} id - The ID of the podcast playlist to retrieve.
   * @return {Promise<PodcastsPlaylist>} A promise that resolves to the retrieved podcast playlist.
   */
  async getOne(id: string): Promise<PodcastsPlaylist> {
    return this.repository.findOne({ where: { id } });
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
    const newFilename = `${file.originalname.trim()}`;
    payload.image = newFilename;
    return this.repository.save(payload);
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
    const newFilename = `${file.originalname.trim()}`;
    if (payload.image) {
      payload.image = newFilename;
    }
    return this.repository.save({ id, ...payload });
  }

  /**
   * Deletes a record from the repository based on the provided id.
   *
   * @param {string} id - The identifier of the record to delete.
   * @return {Promise<DeleteResult>} The result of the deletion operation.
   */
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}
