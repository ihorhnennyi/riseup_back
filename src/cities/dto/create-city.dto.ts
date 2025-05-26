import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 40.7128, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -74.0060, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
} 