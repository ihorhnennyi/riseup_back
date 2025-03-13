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
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsOptional() // ✅ MongoDB сам создаст `_id`
  _id?: string;

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
  role?: string;

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
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((id) => new Types.ObjectId(id)) : [],
  )
  leads?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  integrations?: { type: string; login: string; password: string }[];

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
