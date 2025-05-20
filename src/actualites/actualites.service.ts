import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actualites } from './entities/actualites.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateActualitesDto } from './dto/create-actualites.dto';
import { ActualiteCategoryService } from 'src/actualite-category/actualite-category.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { UpdateActualityDto } from './dto/update-actuality.dto';

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
    const supabaseConfig = {
      SUPABASE_API_KEY: this.configService.get<string>('SUPABASE_API_KEY'),
      SUPABASE_PROJECT_URL: this.configService.get<string>(
        'SUPABASE_PROJECT_URL',
      ),
      SUPABASE_BUCKET_NAME: this.configService.get<string>(
        'SUPABASE_BUCKET_NAME',
      ),
      BASE_URL_IMAGE: this.configService.get<string>('BASE_URL_IMAGE'),
    };

    const supabase = createClient(
      supabaseConfig.SUPABASE_PROJECT_URL,
      supabaseConfig.SUPABASE_API_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
    const category = await this.actualitesCategoryService.getOne(
      payload.categoryId,
    );
    if (!category) {
      throw new BadRequestException("La categorie n'existe pas");
    }

    // Construire le lien de l'image
    const fileName = `actualites-${uuidv4()}.${file.mimetype.split('/').pop()}`;
    const filePath = `${fileName}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from(supabaseConfig.SUPABASE_BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      throw error;
    }
    const { data: publicUrl } = supabase.storage
      .from(supabaseConfig.SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName);

    const actualites = new Actualites();
    actualites.titre = payload.titre;
    actualites.category = category;
    actualites.image = publicUrl.publicUrl;
    actualites.contenu = payload.contenu;
    return this.repository.save(actualites);
  }

  async getOne(id: string): Promise<Actualites> {
    return this.repository.findOne({
      where: {
        id,
        status: true,
      },
    });
  }

  async updateActuality(
    id: string,
    payload: UpdateActualityDto,
    file?: Express.Multer.File,
  ): Promise<Actualites> {
    const supabaseConfig = {
      apiKey: this.configService.get<string>('SUPABASE_API_KEY'),
      projectUrl: this.configService.get<string>('SUPABASE_PROJECT_URL'),
      bucketName: this.configService.get<string>('SUPABASE_BUCKET_NAME'),
      baseUrlImage: this.configService.get<string>('BASE_URL_IMAGE'),
    };

    const supabase = createClient(
      supabaseConfig.projectUrl,
      supabaseConfig.apiKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const existingActualite = await this.getOne(id);
    if (!existingActualite) {
      throw new NotFoundException("L'actualité n'existe pas");
    }

    if (
      payload.categoryId &&
      payload.categoryId !== existingActualite.category.id
    ) {
      const newCategory = await this.actualitesCategoryService.getOne(
        payload.categoryId,
      );
      if (!newCategory) {
        throw new BadRequestException("La categorie n'existe pas");
      }
      existingActualite.category = newCategory;
    }

    if (file) {
      const fileName = `actualites-${uuidv4()}.${file.mimetype.split('/').pop()}`;
      const { error } = await supabase.storage
        .from(supabaseConfig.bucketName)
        .upload(fileName, file.buffer, { contentType: file.mimetype });
      if (error) {
        throw error;
      }
      const { data: publicUrl } = supabase.storage
        .from(supabaseConfig.bucketName)
        .getPublicUrl(fileName);

      existingActualite.image = publicUrl.publicUrl;
    }

    if (payload.titre && payload.titre !== existingActualite.titre) {
      existingActualite.titre = payload.titre;
    }

    if (payload.contenu && payload.contenu !== existingActualite.contenu) {
      existingActualite.contenu = payload.contenu;
    }

    return this.repository.save(existingActualite);
  }

  async deleteActuality(id: string): Promise<UpdateResult> {
    const actualite = await this.getOne(id);
    actualite.status = false;
    return this.repository.update(actualite.id, { status: false });
  }
}
