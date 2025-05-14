import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register-admin')
  @ApiOperation({ summary: 'Реєстрація адміністратора (тільки один раз)' })
  @ApiResponse({ status: 201, description: 'Адміністратор зареєстрований' })
  async registerAdmin(@Body() dto: CreateUserDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вхід у систему' })
  @ApiResponse({ status: 200, description: 'Успішний вхід' })
  @ApiResponse({ status: 401, description: 'Невірний email або пароль' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка входу: ${message}`);
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Оновлення токена' })
  @ApiResponse({ status: 200, description: 'Токен оновлено' })
  @ApiResponse({ status: 401, description: 'Недійсний токен' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(dto.refresh_token);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка оновлення токена: ${message}`);
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вихід із системи' })
  @ApiResponse({ status: 200, description: 'Користувач вийшов' })
  async logout(@Body() dto: RefreshTokenDto) {
    try {
      return await this.authService.logout(dto.refresh_token);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка виходу: ${message}`);
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати інформацію про поточного користувача' })
  @ApiResponse({ status: 200, description: 'Інформація про користувача' })
  @ApiResponse({ status: 401, description: 'Неавторизований доступ' })
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
