import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actualites } from './entities/actualites.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateActualitesDto } from './dto/create-actualites.dto';
import { ActualiteCategoryService } from 'src/actualite-category/actualite-category.service';

@Injectable()
export class ActualitesService {
  constructor(
    @InjectRepository(Actualites)
    private readonly repository: Repository<Actualites>,
    private readonly actualitesCategoryService: ActualiteCategoryService,
  ) {}

  async findAll(): Promise<Actualites[]> {
    return this.repository.find({
      relations: ['category'],
    });
  }

  async create(
    payload: CreateActualitesDto,
    file: Express.Multer.File,
  ): Promise<Actualites> {
    const category = await this.actualitesCategoryService.getOne(
      payload.categoryId,
    );
    if (!category) {
      throw new BadRequestException("La categorie n'existe pas");
    }
    const newFilename = `${file.originalname.trim()}`;
    const actualites = new Actualites();
    actualites.titre = payload.titre;
    actualites.category = category;
    actualites.image = newFilename;
    actualites.contenu = payload.contenu;
    return this.repository.save(actualites);
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
