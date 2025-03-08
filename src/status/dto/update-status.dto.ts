import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ example: 'Обучается', description: 'Название статуса' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '#3498db', description: 'Цвет статуса' })
  @IsOptional()
  @IsString()
  color?: string;
}
