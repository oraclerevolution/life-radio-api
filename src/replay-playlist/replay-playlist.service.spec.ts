import { Test, TestingModule } from '@nestjs/testing';
import { ReplayPlaylistService } from './replay-playlist.service';

describe('ReplayPlaylistService', () => {
  let service: ReplayPlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplayPlaylistService],
    }).compile();

    service = module.get<ReplayPlaylistService>(ReplayPlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
