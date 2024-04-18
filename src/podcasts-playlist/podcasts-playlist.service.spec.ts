import { Test, TestingModule } from '@nestjs/testing';
import { PodcastsPlaylistService } from './podcasts-playlist.service';

describe('PodcastsPlaylistService', () => {
  let service: PodcastsPlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PodcastsPlaylistService],
    }).compile();

    service = module.get<PodcastsPlaylistService>(PodcastsPlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
