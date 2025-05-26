import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './schemas/status.schema';
import { StatusesService } from './statuses.service';

@ApiTags('Статуси кандидатів')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити новий статус', description: 'Доступно тільки для адміністраторів та супер-адміністраторів' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Статус успішно створено',
    type: Status
  })
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusesService.create(createStatusDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати всі активні статуси', description: 'Отримати список всіх активних статусів кандидатів' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список всіх активних статусів',
    type: [Status]
  })
  findAll() {
    return this.statusesService.findAll();
  }

  @Get('callback')
  async getCallbackStatuses() {
    return this.statusesService.getCallbackStatuses();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати статус за ID', description: 'Отримати детальну інформацію про конкретний статус' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус знайдено',
    type: Status
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статус не знайдено'
  })
  findOne(@Param('id') id: string) {
    return this.statusesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оновити статус', description: 'Оновити інформацію про статус. Доступно тільки для адміністраторів' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус успішно оновлено',
    type: Status
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статус не знайдено'
  })
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.statusesService.update(id, updateStatusDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Видалити статус', description: 'Видалити статус. Доступно тільки для адміністраторів' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус успішно видалено',
    type: Status
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статус не знайдено'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Неможливо видалити статус за замовчуванням'
  })
  remove(@Param('id') id: string) {
    return this.statusesService.remove(id);
  }

  @Get('default/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати статус за замовчуванням', description: 'Отримати інформацію про статус, який встановлено за замовчуванням' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус за замовчуванням знайдено',
    type: Status
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статус за замовчуванням не знайдено'
  })
  getDefaultStatus() {
    return this.statusesService.getDefaultStatus();
  }
} 