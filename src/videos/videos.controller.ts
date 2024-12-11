import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('videos')
@ApiHeader({
  name: 'x-lang',
  description: 'Internationalisation (Fr, En)',
  enum: ['fr', 'en'],
})
@ApiTags('Videos')
export class VideosController {
  constructor(private readonly podcastService: VideosService) {}

  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  @Get('one')
  getOne(@Param('id') id: string) {
    return this.podcastService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Upload Video' })
  async create(@Body() payload: CreateVideoDto) {
    return this.podcastService.create(payload);
  }

  @Patch('')
  @ApiOperation({ summary: 'Update Video' })
  async update(@Param('id') id: string, @Body() payload: CreateVideoDto) {
    return this.podcastService.update(id, payload);
  }

  @Patch('delete')
  @ApiOperation({ summary: 'Delete Video' })
  async delete(@Param('id') id: string) {
    return this.podcastService.delete(id);
  }
}
