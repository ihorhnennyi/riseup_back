import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateIntegrationDto } from './dto/create-integration.dto'
import { CreateUserIntegrationDto } from './dto/create-user-integration.dto'
import { IntegrationsService } from './integrations.service'

@ApiTags('Інтеграції')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Створити інтеграцію',
    description: 'Створює нову інтеграцію (шаблон сервісу) для всієї системи. Доступно лише адміністратору.'
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Work.ua',
        url: 'https://work.ua',
        description: 'Імпорт кандидатів з Work.ua',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  createIntegration(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.createIntegration(createIntegrationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Отримати всі інтеграції',
    description: 'Повертає список усіх доступних інтеграцій (шаблонів сервісів) у системі.'
  })
  @UseGuards(JwtAuthGuard)
  findAllIntegrations() {
    return this.integrationsService.findAllIntegrations();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати інтеграцію за ID',
    description: 'Повертає детальну інформацію про інтеграцію (шаблон) за її ID.'
  })
  @UseGuards(JwtAuthGuard)
  findOneIntegration(@Param('id') id: string) {
    return this.integrationsService.findOneIntegration(id);
  }

  @Post('user')
  @ApiOperation({
    summary: 'Підключити інтеграцію користувачу',
    description: 'Додає інтеграцію конкретному користувачу з його логіном і паролем.'
  })
  @ApiBody({
    schema: {
      example: {
        integrationId: '662a1dd8a5a4ed5c9dac7111',
        login: 'ivan@work.ua',
        password: 'qwerty123',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  createUserIntegration(
    @Request() req,
    @Body() createUserIntegrationDto: CreateUserIntegrationDto,
  ) {
    return this.integrationsService.createUserIntegration(req.user.id, createUserIntegrationDto);
  }

  @Get('user/all')
  @ApiOperation({
    summary: 'Отримати всі інтеграції користувача',
    description: 'Повертає список усіх інтеграцій, підключених саме цим користувачем.'
  })
  @UseGuards(JwtAuthGuard)
  findUserIntegrations(@Request() req) {
    return this.integrationsService.findUserIntegrations(req.user.id);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Отримати інтеграцію користувача за ID',
    description: 'Повертає детальну інформацію про одну інтеграцію користувача за її ID.'
  })
  @UseGuards(JwtAuthGuard)
  findOneUserIntegration(@Request() req, @Param('id') id: string) {
    return this.integrationsService.findOneUserIntegration(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  removeIntegration(@Param('id') id: string) {
    return this.integrationsService.removeIntegration(id);
  }
} 