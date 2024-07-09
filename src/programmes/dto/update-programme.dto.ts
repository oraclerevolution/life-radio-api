import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateProgrammeDto {
    @ApiProperty()
    @IsOptional()
    day: string;

    @ApiProperty()
    @IsOptional()
    startingHour: string;

    @ApiProperty()
    @IsOptional()
    endingHour: string;

    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    description: string;
}