import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ 
    example: 'На розгляді',
    description: 'Назва статусу кандидата'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: '#FFD700',
    description: 'Колір статусу в HEX форматі (наприклад, #FFD700)'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Колір повинен бути у форматі HEX (наприклад, #FFD700)',
  })
  color: string;

  @ApiProperty({ 
    example: 'Кандидат знаходиться на етапі розгляду резюме',
    description: 'Детальний опис статусу',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
} 