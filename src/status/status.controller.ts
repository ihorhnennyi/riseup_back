import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enum/user-role.enum';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusService } from './status.service';

@ApiTags('Statuses')
@Controller('statuses')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создать новый статус (только для админов)' })
  @ApiResponse({ status: 201, description: 'Статус создан' })
  async create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все статусы (доступно всем)' })
  @ApiResponse({ status: 200, description: 'Список статусов' })
  async findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить статус по ID' })
  @ApiResponse({ status: 200, description: 'Статус найден' })
  async findOne(@Param('id') id: string) {
    return this.statusService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновить статус (только для админов)' })
  @ApiResponse({ status: 200, description: 'Статус обновлен' })
  async update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Удалить статус (только для админов)' })
  @ApiResponse({ status: 200, description: 'Статус удален' })
  async remove(@Param('id') id: string) {
    return this.statusService.remove(id);
  }
}
