import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ example: 'New', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'New application status', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '#000000', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
} 