import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  age?: number;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  salaryExpectation?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  relocation?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  remoteWork?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workSchedule?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolio?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  statusEndDate?: string;

  // ✅ recruiter должен быть строкой (ObjectId в виде строки)
  @IsMongoId()
  recruiter: string;

  // ✅ statusId может быть строкой (ObjectId)
  @IsOptional()
  @IsMongoId()
  statusId?: string;
}
