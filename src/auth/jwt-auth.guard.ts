import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const cookieToken = request.cookies?.accessToken;

    const allowedRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];

    if (allowedRoutes.includes(request.url)) {
      return true;
    }

    let token: string | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      console.error('Нет токена в Authorization или Cookies');
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded?.sub || !decoded?.role) {
        return false;
      }

      request.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
      console.log('✅ JwtAuthGuard: ', request.user);

      return true;
    } catch (err) {
      return false;
    }
  }
}
