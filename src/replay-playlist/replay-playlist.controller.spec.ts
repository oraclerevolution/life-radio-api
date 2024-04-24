import { Test, TestingModule } from '@nestjs/testing';
import { ReplayPlaylistController } from './replay-playlist.controller';

describe('ReplayPlaylistController', () => {
  let controller: ReplayPlaylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplayPlaylistController],
    }).compile();

    controller = module.get<ReplayPlaylistController>(ReplayPlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
