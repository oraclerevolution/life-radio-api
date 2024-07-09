import { ApiProperty } from '@nestjs/swagger';

export class CreateProgrammeDto {
  @ApiProperty()
  day: string;

  @ApiProperty()
  startingHour: string;

  @ApiProperty()
  endingHour: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
