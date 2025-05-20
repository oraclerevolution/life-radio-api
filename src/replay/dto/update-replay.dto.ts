import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateReplayDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  playlistId?: string;
}
