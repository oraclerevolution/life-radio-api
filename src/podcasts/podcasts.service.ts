import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PodcastsPlaylistService } from 'src/podcasts-playlist/podcasts-playlist.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Podcasts } from './entities/podcast.entity';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import getAudioDurationInSeconds from 'get-audio-duration';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcasts)
    private readonly repository: Repository<Podcasts>,
    private readonly podcastPlaylistService: PodcastsPlaylistService,
  ) {}

  /**
   * Retrieves all podcasts that belong to a specific playlist.
   *
   * @param {string} id - The id of the playlist to filter the podcasts by.
   * @return {Promise<Podcasts[]>} A list of podcasts that belong to the specified playlist.
   */
  async findAll(id: string): Promise<Podcasts[]> {
    return this.repository.find({
      where: { playlist: { id: id } },
    });
  }

  /**
   * Retrieves a single podcast by its ID with related playlist information.
   *
   * @param {string} id - The ID of the podcast to retrieve.
   * @return {Promise<Podcasts>} A promise that resolves to the retrieved podcast with playlist information.
   */
  async getOne(id: string): Promise<Podcasts> {
    return this.repository.findOne({ where: { id }, relations: ['playlist'] });
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

    const playlist = await this.podcastPlaylistService.getOne(playlistId);
    console.log('playlist', playlist);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const duration = await getAudioDurationInSeconds(file.path);

    const podcast = new Podcasts();
    podcast.playlist = playlist;
    podcast.titre = titre;
    podcast.image = playlist.image;
    podcast.duration = duration.toString();
    podcast.audio = file.originalname.trim();

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
  ): Promise<UpdateResult> {
    const { titre } = payload;
    const podcast = await this.getOne(id);
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
    podcast.titre = titre;
    podcast.audio = file.originalname.trim();
    podcast.duration = (await getAudioDurationInSeconds(file.path)).toString();

    return this.repository.update({ id }, podcast);
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
