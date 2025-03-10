import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIntegrationDto {
  @ApiPropertyOptional({ example: 'Slack' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://slack.com' })
  @IsString()
  @IsOptional()
  url?: string;
}
