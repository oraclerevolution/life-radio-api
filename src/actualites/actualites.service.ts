import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actualites } from './entities/actualites.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateActualitesDto } from './dto/create-actualites.dto';
import { ActualiteCategoryService } from 'src/actualite-category/actualite-category.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActualitesService {
  constructor(
    @InjectRepository(Actualites)
    private readonly repository: Repository<Actualites>,
    private readonly actualitesCategoryService: ActualiteCategoryService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Actualites[]> {
    return this.repository.find({
      where: {
        status: true,
      },
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

    // Construire le lien de l'image
    const baseUrl = this.configService.get<string>('BASE_URL'); // URL de base de l'API
    const imageUrl = `${baseUrl}/uploads/actualites/${uuidv4()}-${file.originalname.toLowerCase().trim()}`;

    const actualites = new Actualites();
    actualites.titre = payload.titre;
    actualites.category = category;
    actualites.image = imageUrl;
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

  async deleteActuality(id: string): Promise<UpdateResult> {
    const actualite = await this.getOne(id);
    actualite.status = false;
    return this.repository.update(id, { status: false });
  }
}
