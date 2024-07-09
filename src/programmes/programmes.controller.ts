import { Body, Controller, Get, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgrammesService } from './programmes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Programme } from './entities/programme.entity';
import { CreateProgrammeDto } from './dto/create-programme.dto';
import { UpdateProgrammeDto } from './dto/update-programme.dto';
import { UpdateProgrammeResponseDto } from './dto/update-programme-response.dto';

@Controller('programmes')
@ApiHeader({
    name: 'x-lang',
    description: 'Internationalisation (Fr, En)',
    enum: ['fr', 'en'],
})
@ApiTags('APIs programmes')
export class ProgrammesController {
    constructor(
        private readonly programmesService: ProgrammesService
    ) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new Programme' })
    @ApiBody({ type: CreateProgrammeDto })
    async create(
        @Body() payload: CreateProgrammeDto,
    ): Promise<Programme> {
        return this.programmesService.create(payload);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Programmes' })
    async findAll(): Promise<Programme[]> {
        return this.programmesService.findAll();
    }

    @Get('one-by-day')
    @ApiOperation({ summary: 'Get one Programme by day' })
    async findOneByDay(@Query('day') day: string): Promise<Programme[]> {
        return this.programmesService.findOneByDay(day);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Update a Programme' })
    @ApiBody({ type: UpdateProgrammeDto })
    @ApiOkResponse({
        description: 'The Programme has been successfully updated',
        type: UpdateProgrammeResponseDto,
    })
    async update(
        @Query('id') id: string,
        @Body() payload: UpdateProgrammeDto,
    ): Promise<Programme> {
        return this.programmesService.update(id, payload);
    }
}
