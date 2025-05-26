import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Проверяем, является ли маршрут публичным
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Перевірка JWT автентифікації для ${context.getClass().name}.${context.getHandler().name}`);
    this.logger.debug(`Публічний маршрут: ${isPublic}`);
    
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    this.logger.debug(`Заголовки запиту: ${JSON.stringify(request.headers)}`);

    try {
      const result = await super.canActivate(context);
      this.logger.debug(`Результат JWT автентифікації: ${result}`);
      return result as boolean;
    } catch (error) {
      this.logger.error(`Помилка JWT автентифікації: ${error.message}`, error.stack);
      throw new UnauthorizedException('Недійсний токен або токен не надано');
    }
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(`Обробка JWT запиту - Користувач: ${JSON.stringify(user)}, Помилка: ${err}, Інфо: ${info}`);
    
    if (err || !user) {
      this.logger.error(`Помилка валідації JWT - Помилка: ${err}, Інфо: ${info}`);
      throw err || new UnauthorizedException('Неавторизований доступ');
    }
    return user;
  }
} 