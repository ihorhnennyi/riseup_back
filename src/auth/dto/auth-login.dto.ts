import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'Логин пользователя' })
  username: string;

  @ApiProperty({ example: 'password', description: 'Пароль пользователя' })
  password: string;

  @ApiProperty({
    example: true,
    description: 'Запомнить пользователя',
    required: false,
  })
  rememberMe?: boolean;
}
