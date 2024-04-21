import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveUrl } from './entities/live-url.entity';
import { CreateLiveUrlDto } from './dto/create-live-url.dto';
import { UpdateLiveUrlDto } from './dto/update-live-url.dto';

@Injectable()
export class LiveService {
  constructor(
    @InjectRepository(LiveUrl) private readonly repository: Repository<LiveUrl>,
  ) {}

  findAll(): Promise<LiveUrl[]> {
    return this.repository.find();
  }

  create(payload: CreateLiveUrlDto): Promise<LiveUrl> {
    return this.repository.save(payload);
  }

  update(id: string, payload: UpdateLiveUrlDto): Promise<LiveUrl> {
    return this.repository.save({ id, ...payload });
  }
}
