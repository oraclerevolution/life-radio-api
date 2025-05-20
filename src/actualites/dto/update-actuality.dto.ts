import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateActualityDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contenu?: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
