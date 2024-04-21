import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { LiveService } from './live.service';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LiveUrl } from './entities/live-url.entity';
import { CreateLiveUrlDto } from './dto/create-live-url.dto';
import { UpdateLiveUrlDto } from './dto/update-live-url.dto';

@Controller('live')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('Live URL')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all live URL' })
  async findAll(): Promise<LiveUrl[]> {
    return this.liveService.findAll();
  }

  @Post('')
  @ApiOperation({ summary: 'Create live URL' })
  @ApiBody({ type: CreateLiveUrlDto })
  async create(@Body() payload: CreateLiveUrlDto): Promise<LiveUrl> {
    return this.liveService.create(payload);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update live URL' })
  @ApiBody({ type: UpdateLiveUrlDto })
  async update(
    @Query('id') id: string,
    @Body() payload: UpdateLiveUrlDto,
  ): Promise<LiveUrl> {
    return this.liveService.update(id, payload);
  }
}
