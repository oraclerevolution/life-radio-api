import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActualiteCategory } from './entities/actualite-category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateActualiteCategoryDto } from './dto/create-actualite-category.dto';

@Injectable()
export class ActualiteCategoryService {
  constructor(
    @InjectRepository(ActualiteCategory)
    private readonly repository: Repository<ActualiteCategory>,
  ) {}

  async findAll(): Promise<ActualiteCategory[]> {
    return this.repository.find();
  }

  async create(
    payload: CreateActualiteCategoryDto,
  ): Promise<ActualiteCategory> {
    return this.repository.save(payload);
  }

  async getOne(id: string): Promise<ActualiteCategory> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async updateActuality(
    id: string,
    payload: CreateActualiteCategoryDto,
  ): Promise<ActualiteCategory> {
    return this.repository.save({ id, ...payload });
  }

  async deleteActuality(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}
