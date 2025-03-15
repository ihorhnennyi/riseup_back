import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  async login(
    @Body() body: AuthLoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      body.email,
      body.password,
      body.rememberMe ?? false,
    );

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // res.cookie('accessToken', access_token, {
    //   httpOnly: true,
    //   secure: false, // ✅ Должно быть true, т.к. HTTPS
    //   sameSite: 'none', // ✅ Чтобы работало с другим доменом
    //   path: '/',
    //   maxAge: 24 * 60 * 60 * 1000, // 1 час
    // });

    return res.send({ refresh_token });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токена' })
  async refresh(@Body() body: AuthRefreshDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('session')
  getSession(@Req() req: Request, @Res() res: Response) {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ isAuthenticated: false });

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded.sub) {
        return res
          .status(400)
          .json({ message: 'В токене нет sub пользователя!' });
      }

      return res.json({
        _id: decoded.sub,
        isAuthenticated: true,
        role: decoded.role,
      });
    } catch (err) {
      return res.status(401).json({ isAuthenticated: false });
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    if (!req.user) throw new Error('Пользователь не найден в запросе');

    return {
      id: (req.user as any).id,
      email: (req.user as any).email,
      role: (req.user as any).role,
    };
  }
}
