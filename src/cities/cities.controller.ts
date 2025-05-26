import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './schemas/city.schema';

@ApiTags('Міста')
@Controller('cities')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нове місто' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Місто успішно створено',
    type: City,
  })
  async create(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати всі міста' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список всіх міст',
    type: [City],
  })
  async findAll(): Promise<City[]> {
    return this.citiesService.findAll();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Пошук міст за назвою' })
  @ApiQuery({ name: 'name', required: true, description: 'Назва міста для пошуку' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список міст, що відповідають критеріям пошуку',
    type: [City],
  })
  async searchByName(@Query('name') name: string): Promise<City[]> {
    return this.citiesService.findByName(name);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати місто за ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Місто знайдено',
    type: City,
  })
  async findOne(@Param('id') id: string): Promise<City> {
    return this.citiesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оновити місто' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Місто успішно оновлено',
    type: City,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<City> {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Видалити місто' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Місто успішно видалено',
    type: City,
  })
  async remove(@Param('id') id: string): Promise<City> {
    return this.citiesService.remove(id);
  }
} 