import { ApiProperty } from '@nestjs/swagger';

export class DeleteActualityResponseDto {
  @ApiProperty()
  raw: [];

  @ApiProperty()
  affected: number;
}
