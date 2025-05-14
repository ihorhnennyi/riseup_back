import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './schemas/refresh-token.schema';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async registerAdmin(dto: CreateUserDto) {
    try {
      const admin = await this.usersService.createAdmin(dto);
      this.logger.log(`✅ Адміністратор ${admin.email} успішно зареєстрований`);
      return this.generateTokens(admin);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`❌ Помилка реєстрації адміністратора: ${message}`);
      throw new InternalServerErrorException('Помилка при реєстрації');
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        this.logger.warn(`Спроба входу з неіснуючим email: ${email}`);
        throw new UnauthorizedException('Невірний email або пароль');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Невдала спроба входу: ${email}`);
        throw new UnauthorizedException('Невірний email або пароль');
      }

      await this.refreshTokenModel.deleteMany({
        userId: user._id,
        expiresAt: { $lt: new Date() },
      });

      return this.generateTokens(user);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка входу: ${message}`);
      throw new InternalServerErrorException('Помилка при вході');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Токен відсутній');
      }

      const existingToken = await this.refreshTokenModel.findOne({
        token: refreshToken,
      });

      if (!existingToken) {
        throw new UnauthorizedException('Недійсний токен');
      }

      if (new Date(existingToken.expiresAt) < new Date()) {
        this.logger.warn(`Прострочений refresh-токен: ${refreshToken}`);
        await this.refreshTokenModel.deleteOne({ token: refreshToken });
        throw new UnauthorizedException('Refresh-токен прострочений');
      }

      let payload: JwtPayload;
      try {
        payload = this.jwtService.verify<JwtPayload>(refreshToken, {
          secret: process.env.JWT_SECRET,
        });
      } catch {
        this.logger.warn('JWT токен пошкоджено або невалідний');
        throw new UnauthorizedException('Refresh-токен недійсний');
      }

      const user = await this.usersService.findOneById(payload.id);
      if (!user) {
        this.logger.warn('Спроба оновлення токена для неіснуючого користувача');
        throw new UnauthorizedException('Користувача не знайдено');
      }

      return this.generateTokens(user);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка при оновленні токена: ${message}`);
      throw new InternalServerErrorException('Помилка при оновленні токена');
    }
  }

  async logout(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Токен відсутній');
      }

      let payload: JwtPayload;
      try {
        payload = this.jwtService.verify<JwtPayload>(refreshToken, {
          secret: process.env.JWT_SECRET,
        });
      } catch {
        throw new UnauthorizedException('Refresh-токен недійсний');
      }

      await this.refreshTokenModel.deleteMany({ userId: payload.id });
      this.logger.log(`Користувач ${payload.email} вийшов із системи`);

      return { message: 'Вихід виконано успішно' };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка при виході: ${message}`);
      throw new InternalServerErrorException('Помилка при виході');
    }
  }

  async generateTokens(user: User) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new InternalServerErrorException('JWT_SECRET не встановлено');
      }

      const payload: JwtPayload = {
        id: String(user._id),
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      });

      await this.refreshTokenModel.create({
        token: refreshToken,
        userId: user._id,
        expiresAt: new Date(
          Date.now() +
            this.parseExpiresIn(process.env.JWT_REFRESH_EXPIRES_IN || '30d'),
        ),
      });

      this.logger.log(`✅ Видано новий токен для користувача: ${user.email}`);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невідома помилка';
      this.logger.error(`Помилка при генерації токенів: ${message}`);
      throw new InternalServerErrorException('Помилка при генерації токенів');
    }
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || multipliers.d);
  }
}
