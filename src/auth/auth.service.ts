import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { UserRole } from '../enum/user-role.enum';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // 👈 Логгер

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthRegisterDto): Promise<User> {
    const isFirstUser = (await this.userModel.countDocuments()) === 0;
    const roleToAssign = isFirstUser
      ? UserRole.ADMIN
      : (dto.role ?? UserRole.USER);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new this.userModel({
      firstName: dto.firstName,
      email: dto.email,
      password: hashedPassword,
      role: roleToAssign,
    });

    await newUser.save();
    this.logger.log(
      `🆕 Новый пользователь зарегистрирован: ${dto.email}, Роль: ${roleToAssign}`,
    );
    return newUser;
  }

  async login(email: string, password: string, rememberMe: boolean) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn(`⚠️ Неудачная попытка входа: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`✅ Успешный вход: ${email}`);
    return this.generateTokens(user, rememberMe);
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      this.logger.warn('⚠️ Попытка обновления без токена');
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(decoded.sub).exec();

      if (!user || !user.refreshToken) {
        this.logger.warn(
          `⚠️ Недействительный refresh-токен для пользователя ${decoded.username}`,
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      const decryptedToken = this.decryptRefreshToken(user.refreshToken);
      if (refreshToken !== decryptedToken) {
        this.logger.warn(
          `🚨 Попытка использования поддельного refresh-токена пользователем ${decoded.username}`,
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      this.logger.log(`🔄 Обновление токена для ${user.email}`);
      return this.generateTokens(user);
    } catch (error) {
      this.logger.error(
        `❌ Ошибка обновления refresh-токена: ${error.message}`,
      );
      throw new UnauthorizedException(
        'Refresh token expired, please login again',
      );
    }
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.warn(
        `⚠️ Попытка выхода несуществующего пользователя: ${userId}`,
      );
      throw new UnauthorizedException('User not found');
    }

    user.refreshToken = undefined;
    await user.save();
    this.logger.log(`🚪 Пользователь ${user.email} вышел из системы`);

    return { message: 'User logged out successfully' };
  }

  async logoutAll(userId: string) {
    return this.logout(userId);
  }

  private async generateTokens(
    user: UserDocument,
    rememberMe: boolean = false,
  ) {
    const payload = {
      username: user.email, // ✅ Убедись, что передаётся email
      sub: user.id.toString(),
      role: user.role,
      email: user.email, // ✅ Добавляем email, так как его нет в декодированном JWT
    };

    console.log('📜 Payload перед подписью JWT:', payload); // ✅ Логируем данные

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '30d' : '1d',
    });

    const encryptedRefreshToken = this.encryptRefreshToken(refreshToken);
    user.refreshToken = encryptedRefreshToken;
    await user.save();

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private encryptRefreshToken(token: string): string {
    try {
      const key = Buffer.from(process.env.REFRESH_SECRET ?? '', 'utf-8');
      const iv = Buffer.from(process.env.IV_SECRET ?? '', 'utf-8');

      if (key.length !== 32) {
        throw new Error(
          `REFRESH_SECRET должен быть 32 байта, а сейчас ${key.length}`,
        );
      }
      if (iv.length !== 16) {
        throw new Error(`IV_SECRET должен быть 16 байт, а сейчас ${iv.length}`);
      }

      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(token, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return encrypted;
    } catch (error) {
      this.logger.error(
        `❌ Ошибка шифрования refresh-токена: ${error.message}`,
      );
      throw new Error('Ошибка при генерации токена');
    }
  }

  private decryptRefreshToken(encryptedToken: string): string {
    const key = Buffer.from(process.env.REFRESH_SECRET ?? '', 'utf-8');
    const iv = Buffer.from(process.env.IV_SECRET ?? '', 'utf-8');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
