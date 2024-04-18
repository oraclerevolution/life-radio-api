import { Test, TestingModule } from '@nestjs/testing';
import { PodcastsPlaylistController } from './podcasts-playlist.controller';

describe('PodcastsPlaylistController', () => {
  let controller: PodcastsPlaylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodcastsPlaylistController],
    }).compile();

    controller = module.get<PodcastsPlaylistController>(PodcastsPlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
