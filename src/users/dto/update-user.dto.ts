import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'user@rise.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'StrongPassword123!', required: false })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.RECRUITER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: 'HR Department', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: 'HR Manager', required: false })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsString()
  @IsOptional()
  city?: any;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsString()
  @IsOptional()
  branch?: any;
} 