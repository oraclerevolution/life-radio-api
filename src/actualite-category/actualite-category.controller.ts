import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ActualiteCategoryService } from './actualite-category.service';
import { GetActualitesCategoryDto } from './dto/get-actualite-category.dto';
import { ActualiteCategory } from './entities/actualite-category.entity';
import { CreateActualiteCategoryDto } from './dto/create-actualite-category.dto';
import { UpdateActualitesCategoryResponseDto } from './dto/update-actualites-category-response.dto';
import { DeleteActualityResponseDto } from 'src/actualites/dto/delete-actuality-response.dto';

@Controller('actualite-category')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('APIs Actuality Category')
export class ActualiteCategoryController {
  constructor(
    private readonly actualiteCategoryService: ActualiteCategoryService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Get list of actualities category' })
  @ApiOkResponse({
    description:
      'The categories of actuality have been successfully retrieved.',
    type: GetActualitesCategoryDto,
  })
  async findAll(): Promise<ActualiteCategory[]> {
    return this.actualiteCategoryService.findAll();
  }

  @Post('')
  @ApiOperation({ summary: 'Create new actuality category' })
  @ApiOkResponse({
    description: 'The category of actuality has been successfully created.',
    type: CreateActualiteCategoryDto,
  })
  async create(
    @Body() body: CreateActualiteCategoryDto,
  ): Promise<ActualiteCategory> {
    return this.actualiteCategoryService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one actuality category' })
  @ApiOkResponse({
    description: 'The category of actuality has been successfully retrieved.',
    type: GetActualitesCategoryDto,
  })
  async findOne(@Query('id') id: string): Promise<ActualiteCategory> {
    return this.actualiteCategoryService.getOne(id);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update actuality category' })
  @ApiOkResponse({
    description: 'The category of actuality has been successfully updated.',
    type: UpdateActualitesCategoryResponseDto,
  })
  async updateActuality(
    @Query('id') id: string,
    @Body() body: CreateActualiteCategoryDto,
  ) {
    return this.actualiteCategoryService.updateActuality(id, body);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete actuality category' })
  @ApiOkResponse({
    description: 'The category of actuality has been successfully deleted.',
    type: DeleteActualityResponseDto,
  })
  async deleteActuality(@Query('id') id: string) {
    return this.actualiteCategoryService.deleteActuality(id);
  }
}
