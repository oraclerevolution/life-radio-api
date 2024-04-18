import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actualites } from './entities/actualites.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateActualitesDto } from './dto/create-actualites.dto';

@Injectable()
export class ActualitesService {
  constructor(
    @InjectRepository(Actualites)
    private readonly repository: Repository<Actualites>,
  ) {}

  async findAll(): Promise<Actualites[]> {
    return this.repository.find();
  }

  async create(
    payload: CreateActualitesDto,
    file: Express.Multer.File,
  ): Promise<Actualites> {
    const newFilename = `${file.originalname.trim()}`;
    payload.image = newFilename;
    return this.repository.save(payload);
  }

  async getOne(id: string): Promise<Actualites> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async updateActuality(
    id: string,
    payload: CreateActualitesDto,
  ): Promise<Actualites> {
    return this.repository.save({ id, ...payload });
  }

  async deleteActuality(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}
