import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateActualityDto {
  @ApiProperty()
  @IsOptional()
  titre: string;

  @ApiProperty()
  @IsOptional()
  contenu: string;

  @ApiProperty()
  @IsOptional()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  image: string;
}
