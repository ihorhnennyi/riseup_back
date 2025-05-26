import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ 
    example: 'Філія Київ-Центр',
    description: 'Назва філії'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'Центральний офіс у Києві',
    description: 'Опис філії',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID міста, де знаходиться філія'
  })
  @IsMongoId()
  @IsNotEmpty()
  city: string;
} 