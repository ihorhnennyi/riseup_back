import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { AuthResponse } from './interfaces/auth-response.interface'
import { Tokens } from './interfaces/tokens.interface'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірні облікові дані');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Користувач неактивний');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userInfo = {
      id: user._id ? user._id.toString() : user.id,
      firstName: user.firstName,
      role: user.role
    };

    return {
      success: true,
      message: `Ласкаво просимо, ${user.firstName}!`,
      data: {
        user: userInfo,
        tokens,
      },
    };
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }
} 