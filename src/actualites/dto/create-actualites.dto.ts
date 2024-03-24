import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Actualites } from "../entities/actualites.entity";
import { IsString } from "class-validator";

export class CreateActualitesDto {
    @ApiProperty()
    titre: string;

    @ApiProperty()
    contenu: string;

    @ApiProperty()
    categoryId: string
}