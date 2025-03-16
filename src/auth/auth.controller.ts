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
import { InjectModel } from '@nestjs/mongoose'; // ✅ Добавлен
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Model, Types } from 'mongoose'; // ✅ Добавлен
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User, UserDocument } from './schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post('register') // ✅ Добавляем маршрут для регистрации
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

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
  async getSession(@Req() req: Request, @Res() res: Response) {
    console.log('🔍 Проверка сессии...');

    const token =
      req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ Токен отсутствует');
      return res.status(401).json({ isAuthenticated: false });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      console.log('🔓 Расшифрованный токен:', decoded);

      if (!decoded.sub) {
        console.log('⚠️ В токене нет sub');
        return res
          .status(400)
          .json({ message: 'В токене нет sub пользователя!' });
      }

      // 🔹 Приведение `decoded.sub` к `ObjectId`
      const userId = new Types.ObjectId(decoded.sub);
      console.log('🔎 Ищем пользователя с ID:', userId);

      // 🔹 Найти пользователя в базе + подгрузить интеграции
      const user = await this.userModel
        .findById(userId)
        .populate('integrations');

      if (!user) {
        console.log('❌ Пользователь не найден');
        return res.status(404).json({ message: 'Пользователь не найден!' });
      }

      console.log('✅ Сессия найдена:', user);

      return res.json({
        _id: user._id,
        isAuthenticated: true,
        role: user.role,
        integrations: user.integrations,
      });
    } catch (err) {
      console.log('❌ Ошибка верификации токена:', err.message);
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
