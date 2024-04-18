import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
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
import { DeleteActualityResponseDto } from './dto/delete-actuality-response.dto';
import { UpdateActualityResponseDto } from './dto/update-actuality-response.dto';
import { ActualiteCategoryService } from 'src/actualite-category/actualite-category.service';

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
  @ApiOperation({ summary: 'Create an actuality' })
  @ApiBody({ type: CreateActualitesDto })
  @ApiOkResponse({
    description: 'The actuality has been successfully created.',
    type: CreateActualityResponseDto,
  })
  async create(@Body() payload: CreateActualitesDto): Promise<Actualites> {
    const { categoryId } = payload;
    const checkIfCategoryExist =
      await this.actualitesCategoryService.getOne(categoryId);
    if (!checkIfCategoryExist) {
      throw new BadRequestException("La categorie n'existe pas");
    }
    return this.actualitesService.create(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an actuality' })
  @ApiOkResponse({
    description: 'The actualities have been successfully retrieved.',
    type: GetActualitesDto,
  })
  async getOne(@Query('id') id: string): Promise<Actualites> {
    return this.actualitesService.getOne(id);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update an actuality' })
  @ApiBody({ type: CreateActualitesDto })
  @ApiOkResponse({
    description: 'The actuality has been successfully updated.',
    type: UpdateActualityResponseDto,
  })
  async updateActuality(
    @Query('id') id: string,
    @Body() payload: UpdateActualityDto,
  ) {
    return this.actualitesService.updateActuality(id, payload);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete an actuality' })
  @ApiOkResponse({
    description: 'The actuality has been successfully deleted.',
    type: DeleteActualityResponseDto,
  })
  async deleteActuality(@Query('id') id: string) {
    return this.actualitesService.deleteActuality(id);
  }
}
