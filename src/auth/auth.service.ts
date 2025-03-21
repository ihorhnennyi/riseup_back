import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { UserRole } from '../enum/user-role.enum';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthRegisterDto): Promise<User> {
    const isFirstUser = (await this.userModel.countDocuments()) === 0;
    const roleToAssign = isFirstUser
      ? UserRole.ADMIN
      : (dto.role ?? UserRole.RECRUITER);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new this.userModel({
      _id: new Types.ObjectId(), // 🔥 Добавляем ID вручную, если MongoDB его не создаёт
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || UserRole.RECRUITER,
    });

    await newUser.save();
    // Теперь MongoDB сам создаст _id

    this.logger.log(
      `🆕 Пользователь зарегистрирован: ${dto.email}, Роль: ${roleToAssign}`,
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
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(decoded.sub).exec();

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const decryptedToken = process.env.USE_REFRESH_ENCRYPTION
        ? this.decryptRefreshToken(user.refreshToken)
        : user.refreshToken;

      if (refreshToken !== decryptedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token expired, please login again',
      );
    }
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    user.refreshToken = undefined;
    await user.save();
    return { message: 'User logged out successfully' };
  }

  private async generateTokens(
    user: UserDocument | null, // 👈 Добавляем возможность null
    rememberMe: boolean = false,
  ) {
    if (!user || !user._id) {
      // 👈 Добавляем проверку на user и user._id
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '30d' : '1d',
    });

    user.refreshToken = process.env.USE_REFRESH_ENCRYPTION
      ? this.encryptRefreshToken(refreshToken)
      : refreshToken;
    await user.save();

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private encryptRefreshToken(token: string): string {
    const key = Buffer.from(process.env.REFRESH_SECRET ?? '', 'utf-8');
    const iv = Buffer.from(process.env.IV_SECRET ?? '', 'utf-8');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
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
