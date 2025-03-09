import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;

  @ApiProperty({
    example: true,
    description: 'Запомнить пользователя (необязательно)',
    required: false,
  })
  @IsOptional()
  rememberMe?: boolean;
}
