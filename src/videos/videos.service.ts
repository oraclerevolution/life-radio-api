import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private readonly repository: Repository<Video>,
  ) {}

  findAll(): Promise<Video[]> {
    return this.repository.find();
  }

  create(payload: CreateVideoDto): Promise<Video> {
    return this.repository.save(payload);
  }

  getOne(id: string): Promise<Video> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, payload: UpdateVideoDto): Promise<Video> {
    await this.repository.update(id, payload);
    return this.getOne(id);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
