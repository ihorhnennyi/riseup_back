import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'Игорь', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Тестов', description: 'Фамилия пользователя' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+1234567890', description: 'Телефон' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'igor@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'recruiter',
    description: 'Роль пользователя',
    default: 'recruiter',
  })
  @IsOptional()
  @IsString()
  role?: string = 'recruiter'; // 🔹 Добавлен `default`
}
