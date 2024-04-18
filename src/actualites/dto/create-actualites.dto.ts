import { ApiProperty } from '@nestjs/swagger';

export class CreateActualitesDto {
  @ApiProperty()
  titre: string;

  @ApiProperty()
  contenu: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  image: string;
}
