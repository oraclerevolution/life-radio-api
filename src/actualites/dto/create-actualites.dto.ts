import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateActualitesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
