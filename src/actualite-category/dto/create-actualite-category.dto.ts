import { ApiProperty } from "@nestjs/swagger";

export class CreateActualiteCategoryDto {
    @ApiProperty()
    name: string
}