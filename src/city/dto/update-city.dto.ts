import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCityDto {
  @ApiPropertyOptional({ example: 'Днепр' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Украина' })
  @IsString()
  @IsOptional()
  country?: string;
}
