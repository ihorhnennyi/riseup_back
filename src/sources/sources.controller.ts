import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { SourcesService } from './sources.service';

@ApiTags('Джерела')
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Створити джерело', description: 'Додає нове джерело для кандидатів.' })
  @ApiBody({ type: CreateSourceDto })
  @ApiResponse({ status: 201, description: 'Джерело створено.' })
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(createSourceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі джерела', description: 'Повертає список усіх джерел.' })
  @ApiResponse({ status: 200, description: 'Список джерел.' })
  findAll() {
    return this.sourcesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати джерело за ID', description: 'Повертає детальну інформацію про джерело.' })
  @ApiResponse({ status: 200, description: 'Детальна інформація про джерело.' })
  findOne(@Param('id') id: string) {
    return this.sourcesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити джерело', description: 'Оновлює дані джерела за ID.' })
  @ApiBody({ type: UpdateSourceDto })
  @ApiResponse({ status: 200, description: 'Джерело оновлено.' })
  update(@Param('id') id: string, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourcesService.update(id, updateSourceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити джерело', description: 'Видаляє джерело за ID.' })
  @ApiResponse({ status: 200, description: 'Джерело видалено.' })
  remove(@Param('id') id: string) {
    return this.sourcesService.remove(id);
  }
} 