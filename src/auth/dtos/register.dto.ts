import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
    required: true,
  })
  @IsEmail({}, { message: 'Некоректний email' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Пароль повинен містити не менше 8 символів, хоча б одну велику літеру та одну цифру',
    minLength: 8,
    required: true,
  })
  @IsNotEmpty({ message: 'Пароль є обов’язковим' })
  @MinLength(8, { message: 'Пароль повинен містити не менше 8 символів' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Пароль повинен містити хоча б одну велику літеру та цифру',
  })
  password: string;

  @ApiProperty({
    example: UserRole.RECRUITER,
    description: 'Роль користувача',
    enum: UserRole,
    required: true,
  })
  @IsEnum(UserRole, { message: 'Роль повинна бути admin або recruiter' })
  role: UserRole;
}
