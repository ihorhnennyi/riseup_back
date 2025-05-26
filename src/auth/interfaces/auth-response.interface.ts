import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../common/enums/role.enum'
import { Tokens } from './tokens.interface'

// Минимальная информация о пользователе при авторизации
class AuthUserInfo {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Admin' })
  firstName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.SUPER_ADMIN })
  role: UserRole;
}

export class AuthResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Welcome back, Admin!' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        id: '507f1f77bcf86cd799439011',
        firstName: 'Admin',
        role: 'super_admin'
      },
      tokens: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  data: {
    user: AuthUserInfo;
    tokens: Tokens;
  };
} 