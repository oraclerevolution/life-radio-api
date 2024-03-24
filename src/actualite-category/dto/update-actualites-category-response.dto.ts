import { ApiProperty } from "@nestjs/swagger"

export class UpdateActualitesCategoryResponseDto {
    @ApiProperty()
    raw: []

    @ApiProperty()
    affected: number
}