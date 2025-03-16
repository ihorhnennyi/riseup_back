import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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

  // ✅ Статус можно передавать (MongoId в виде строки)
  @IsOptional()
  @IsMongoId()
  statusId?: string;

  // ✅ Можно передавать нового рекрутера
  @IsOptional()
  @IsMongoId()
  recruiter?: string;
}
