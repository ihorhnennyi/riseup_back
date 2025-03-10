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
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { IntegrationService } from './integration.service';

@ApiTags('Integrations')
@Controller('integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создать новую интеграцию (только для админов)' })
  @ApiResponse({ status: 201, description: 'Интеграция создана' })
  async create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationService.create(createIntegrationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список интеграций (доступно всем)' })
  @ApiResponse({ status: 200, description: 'Список интеграций' })
  async findAll() {
    return this.integrationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию об интеграции' })
  @ApiResponse({ status: 200, description: 'Детали интеграции' })
  async findOne(@Param('id') id: string) {
    return this.integrationService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновить интеграцию (только для админов)' })
  @ApiResponse({ status: 200, description: 'Интеграция обновлена' })
  async update(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto,
  ) {
    return this.integrationService.update(id, updateIntegrationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Удалить интеграцию (только для админов)' })
  @ApiResponse({ status: 200, description: 'Интеграция удалена' })
  async remove(@Param('id') id: string) {
    return this.integrationService.remove(id);
  }
}
