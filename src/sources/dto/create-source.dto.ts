import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSourceDto {
  @ApiProperty({ description: 'Назва джерела' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Опис джерела' })
  @IsOptional()
  @IsString()
  description?: string;
} 