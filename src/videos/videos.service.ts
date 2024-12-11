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
    return this.repository.find({
      where: {
        status: true,
      },
    });
  }

  create(payload: CreateVideoDto): Promise<Video> {
    return this.repository.save(payload);
  }

  getOne(id: string): Promise<Video> {
    return this.repository.findOne({
      where: {
        id,
        status: true,
      },
    });
  }

  async update(id: string, payload: UpdateVideoDto): Promise<Video> {
    await this.repository.update(id, payload);
    return this.getOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const video = await this.getOne(id);
    return this.repository.update(video.id, { status: false });
  }
}
