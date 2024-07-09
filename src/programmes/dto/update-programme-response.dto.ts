import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgrammeResponseDto {
  @ApiProperty()
  raw: [];

  @ApiProperty()
  affected: number;
}
