import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader: string | undefined = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('❗️Токен відсутній або некоректний');
      throw new UnauthorizedException('Токен відсутній або некоректний');
    }

    const isAllowed = (await super.canActivate(context)) as boolean;

    if (!request.user) {
      this.logger.warn('❗️Користувача не знайдено після аутентифікації');
      throw new UnauthorizedException('Аутентифікація не вдалася');
    }

    return isAllowed;
  }
}
