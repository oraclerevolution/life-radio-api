import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateReplayDto {
  @ApiProperty()
  @IsString()
  titre: string;
}
