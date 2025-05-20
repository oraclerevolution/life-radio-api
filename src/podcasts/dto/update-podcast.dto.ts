import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePodcastDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  playlistId?: string;
}
