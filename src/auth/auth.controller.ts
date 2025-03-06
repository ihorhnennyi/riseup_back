import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from 'src/enum/user-role.enum';
import { AuthService } from './auth.service';
<<<<<<< HEAD

=======
>>>>>>> feature/auth-guards
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

<<<<<<< HEAD
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const tokens = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!tokens) {
      return { message: 'Invalid credentials' };
    }
=======
  @Post('register')
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
  async login(@Body() body: { username: string; password: string }) {
    const tokens = await this.authService.login(body.username, body.password);
>>>>>>> feature/auth-guards
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }
}
