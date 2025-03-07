import { Body, Controller, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { UserRole } from 'src/enum/user-role.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(
    @Body() body: { username: string; password: string; rememberMe?: boolean },
    @Res() res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      body.username,
      body.password,
      body.rememberMe ?? false,
    );

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    return res.send({ refresh_token });
  }

  @Post('refresh')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }, @Res() res: Response) {
    await this.authService.logout(body.userId);

    res.clearCookie('accessToken');
    return res.send({ message: 'User logged out successfully' });
  }
}
