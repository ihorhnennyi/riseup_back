import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../enum/user-role.enum';

export class AuthRegisterDto {
  @ApiProperty({
    example: 'newuser@gmail.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  username: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Пароль (минимум 6 символов)',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;

  @ApiProperty({
    example: UserRole.USER,
    enum: UserRole,
    description: 'Роль пользователя (по умолчанию user)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value as UserRole)
  @IsEnum(UserRole, { message: 'Роль должна быть user или admin' })
  role?: UserRole;
}
