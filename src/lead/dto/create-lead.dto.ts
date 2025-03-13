import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

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

  @IsInt()
  @Type(() => Number)
  age: number;

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

  @IsBoolean()
  @Type(() => Boolean)
  relocation: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  remoteWork: boolean;

  @IsArray()
  @IsString({ each: true })
  workSchedule: string[];

  @IsArray()
  @IsString({ each: true })
  portfolio: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  statusEndDate?: string;

  @IsOptional()
  recruiter?: Types.ObjectId;

  @IsOptional()
  @Type(() => Types.ObjectId)
  statusId?: Types.ObjectId;
}
