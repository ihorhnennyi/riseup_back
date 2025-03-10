import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../../enum/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  viber?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  cities?: string[];

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsArray()
  leads?: string[];

  @IsOptional()
  @IsArray()
  integrations?: { type: string; login: string; password: string }[];

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
