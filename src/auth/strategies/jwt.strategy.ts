import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('❌ Змінна середовища JWT_SECRET не встановлена!');
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(options);
  }

  validate(payload: JwtPayload) {
    if (!payload?.id || !payload?.email || !payload?.role) {
      this.logger.warn(`❌ Невалідний токен: ${JSON.stringify(payload)}`);
      throw new UnauthorizedException('Недійсний токен');
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
