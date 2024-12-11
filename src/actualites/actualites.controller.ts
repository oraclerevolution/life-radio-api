import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ActualitesService } from './actualites.service';
import { Actualites } from './entities/actualites.entity';
import { GetActualitesDto } from './dto/get-actualites.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateActualitesDto } from './dto/create-actualites.dto';
import { CreateActualityResponseDto } from './dto/create-actuality-response.dto';
import { UpdateActualityDto } from './dto/update-actuality.dto';
import { UpdateActualityResponseDto } from './dto/update-actuality-response.dto';
import { ActualiteCategoryService } from 'src/actualite-category/actualite-category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

@Controller('actualites')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('APIs Actualités')
export class ActualitesController {
  constructor(
    private readonly actualitesService: ActualitesService,
    private readonly actualitesCategoryService: ActualiteCategoryService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Get list of actualities' })
  @ApiOkResponse({
    description: 'The actualities have been successfully retrieved.',
    type: GetActualitesDto,
  })
  async findAll(): Promise<Actualites[]> {
    return this.actualitesService.findAll();
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/actualites',
        filename: (req, file, cb) => {
          const newFilename = `${file.originalname.trim()}`;
          cb(null, newFilename);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create an actuality' })
  @ApiBody({ type: CreateActualitesDto })
  @ApiOkResponse({
    description: 'The actuality has been successfully created.',
    type: CreateActualityResponseDto,
  })
  async create(
    @Body() payload: CreateActualitesDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Actualites> {
    const { categoryId } = payload;
    const checkIfCategoryExist =
      await this.actualitesCategoryService.getOne(categoryId);
    if (!checkIfCategoryExist) {
      throw new BadRequestException("La categorie n'existe pas");
    }
    return this.actualitesService.create(payload, file);
  }

  @Get('one')
  @ApiOperation({ summary: 'Get an actuality' })
  @ApiOkResponse({
    description: 'The actualities have been successfully retrieved.',
    type: GetActualitesDto,
  })
  async getOne(@Param('id') id: string): Promise<Actualites> {
    return this.actualitesService.getOne(id);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update an actuality' })
  @ApiBody({ type: UpdateActualityDto })
  @ApiOkResponse({
    description: 'The actuality has been successfully updated.',
    type: UpdateActualityResponseDto,
  })
  async updateActuality(
    @Param('id') id: string,
    @Body() payload: UpdateActualityDto,
  ) {
    return this.actualitesService.updateActuality(id, payload);
  }

  @Patch('delete')
  @ApiOperation({ summary: 'Delete an actuality' })
  @ApiOkResponse({
    description: 'The actuality has been successfully deleted.',
  })
  async deleteActuality(@Param('id') id: string) {
    return this.actualitesService.deleteActuality(id);
  }
}
