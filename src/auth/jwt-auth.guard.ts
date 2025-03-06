import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const allowedRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];

    if (allowedRoutes.includes(request.url)) {
      console.log('Разрешённый маршрут, пропускаем без авторизации');
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Нет заголовка Authorization');
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded || !decoded.sub || !decoded.role) {
        console.error('Токен не содержит sub или role:', decoded);
        return false;
      }

      request.user = {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
      };

      return true;
    } catch (err) {
      console.error('Ошибка валидации JWT:', err.message);
      return false;
    }
  }
}
