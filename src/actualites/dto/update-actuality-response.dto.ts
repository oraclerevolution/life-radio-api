import { ApiProperty } from "@nestjs/swagger"

export class UpdateActualityResponseDto {
    @ApiProperty()
    raw: []

    @ApiProperty()
    affected: number
}