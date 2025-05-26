import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@rise.com',
    description: 'Електронна пошта користувача'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'StrongPassword123!',
    description: 'Пароль користувача'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
} 