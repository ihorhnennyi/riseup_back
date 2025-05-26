import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() middleName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() age?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() position?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() salary?: number;
  @ApiPropertyOptional({ description: 'ID міста (City)' }) @IsOptional() @IsMongoId() city?: string;
  @ApiPropertyOptional({ description: 'ID джерела (Source)' }) @IsOptional() @IsMongoId() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ description: 'ID автора (User)' }) @IsOptional() @IsMongoId() createdBy?: string;
  @ApiPropertyOptional({ description: 'ID статусу (Status)' }) @IsOptional() @IsMongoId() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() callbackStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() callbackDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employmentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() interviewDate?: Date;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() integrationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() resumeUrl?: string;
  @ApiPropertyOptional({ description: 'ID рекрутера (User)' }) @IsOptional() @IsMongoId() assignedRecruiter?: string;
} 