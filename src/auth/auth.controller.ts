import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('csrf-token')
  @ApiOperation({ summary: 'Получить CSRF токен' })
  @ApiResponse({ status: 200, description: 'CSRF токен успешно получен' })
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    if (typeof req.csrfToken === 'function') {
      const csrfToken = req.csrfToken();

      res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return res.json({ csrfToken });
    }

    return res
      .status(500)
      .json({ message: 'CSRF middleware не настроен корректно' });
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body.username, body.password, body.role);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Успешная авторизация. Возвращает refresh-токен.',
    schema: {
      example: {
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Ошибка CSRF-токена' })
  @ApiResponse({ status: 400, description: 'Некорректные учетные данные' })
  @ApiResponse({ status: 429, description: 'Слишком много запросов' })
  @ApiBody({
    description: 'Данные для входа',
    schema: {
      example: {
        username: 'test@gmail.com',
        password: 'password123',
        rememberMe: true,
      },
    },
  })
  async login(
    @Body() body: AuthLoginDto,
    @Headers('x-xsrf-token') csrfToken: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const cookieToken = req.cookies['XSRF-TOKEN'];

    if (!csrfToken || csrfToken !== cookieToken) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    const { access_token, refresh_token } = await this.authService.login(
      body.username,
      body.password,
      body.rememberMe ?? false,
    );

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    return res.send({ refresh_token });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({ status: 201, description: 'Токен успешно обновлен' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async refresh(@Body() body: AuthRefreshDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({ status: 201, description: 'Выход выполнен' })
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken');
    return res.send({ message: 'User logged out successfully' });
  }

  @Post('logoutAll')
  @ApiOperation({ summary: 'Выход со всех устройств' })
  @ApiResponse({ status: 201, description: 'Выход со всех устройств выполнен' })
  async logoutAll(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken');
    return res.send({ message: 'Logged out from all devices' });
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Тест защищенного маршрута' })
  @ApiResponse({ status: 200, description: 'Доступ разрешен' })
  getProtectedResource(@Req() req: Request) {
    return {
      message: 'You have access to this protected route',
      user: req.user,
    };
  }
}
