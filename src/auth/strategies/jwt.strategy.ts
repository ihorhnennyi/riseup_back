import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET')
    if (!jwtSecret) {
      throw new Error('JWT_SECRET не визначено')
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    })
  }

  async validate(payload: any) {
    this.logger.debug(`Валідація JWT даних: ${JSON.stringify(payload)}`);

    try {
      const userResponse = await this.usersService.findById(payload.sub)
      
      if (!userResponse || !userResponse.data) {
        this.logger.error(`Користувача не знайдено для даних: ${JSON.stringify(payload)}`);
        throw new UnauthorizedException('Користувача не знайдено')
      }

      if (!userResponse.data.isActive) {
        this.logger.error(`Користувач ${payload.sub} неактивний`);
        throw new UnauthorizedException('Користувач неактивний')
      }

      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        ...userResponse.data
      };

      this.logger.debug(`Успішна валідація користувача: ${JSON.stringify({ id: user.id, email: user.email, role: user.role })}`);
      return user;
    } catch (error) {
      this.logger.error(`Помилка валідації токена: ${error.message}`, error.stack);
      throw error;
    }
  }
} 