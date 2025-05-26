import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateSuperAdminDto {
  @ApiProperty({ example: 'admin@rise.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Super' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'IT Department' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'Chief Technology Officer' })
  @IsString()
  @IsNotEmpty()
  position: string;
} 