import { ApiProperty } from "@nestjs/swagger";
import { Actualites } from "../entities/actualites.entity";

export class GetActualitesDto {
    @ApiProperty()
    result: Actualites[];
    @ApiProperty()
    count: number
  }