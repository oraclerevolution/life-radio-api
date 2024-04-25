import { ApiProperty } from '@nestjs/swagger';

export class DeleteActualitesCategoryResponseDto {
  @ApiProperty()
  raw: [];

  @ApiProperty()
  affected: number;
}
