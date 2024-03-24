import { ApiProperty } from "@nestjs/swagger";
import { Actualites } from "../entities/actualites.entity";
import { UpdateResult } from "typeorm";

export class CreateActualityResponseDto {
    @ApiProperty()
    result: UpdateResult;
  }