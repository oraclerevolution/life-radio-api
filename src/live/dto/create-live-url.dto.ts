import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLiveUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;
}
