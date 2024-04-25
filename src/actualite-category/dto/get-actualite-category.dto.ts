import { ApiProperty } from '@nestjs/swagger';
import { ActualiteCategory } from '../entities/actualite-category.entity';

export class GetActualitesCategoryDto {
  @ApiProperty()
  result: ActualiteCategory[];
  @ApiProperty()
  count: number;
}
