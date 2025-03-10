import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIntegrationDto {
  @ApiProperty({ example: 'Slack' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://slack.com' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
