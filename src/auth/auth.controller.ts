import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from 'src/enum/user-role.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // ✅ 5 попыток за 60 секунд
  async register(
    @Body() body: { username: string; password: string; role?: string },
  ) {
    return this.authService.register(
      body.username,
      body.password,
      body.role as UserRole,
    );
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // ✅ 5 попыток за 60 секунд
  async login(
    @Body() body: { username: string; password: string; rememberMe?: boolean },
  ) {
    return this.authService.login(
      body.username,
      body.password,
      body.rememberMe ?? false,
    );
  }

  @Post('refresh')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // ✅ 5 попыток за 60 секунд
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }
}
