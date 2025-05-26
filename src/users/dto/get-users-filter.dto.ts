import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';

export class GetUsersFilterDto {
  @ApiProperty({ 
    required: false,
    description: 'Фільтр за роллю користувача'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ 
    required: false,
    description: 'Пошук за ім\'ям або прізвищем'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ 
    required: false,
    description: 'Фільтр за філією'
  })
  @IsMongoId()
  @IsOptional()
  branch?: string;

  @ApiProperty({ 
    required: false,
    description: 'Фільтр за містом'
  })
  @IsMongoId()
  @IsOptional()
  city?: string;

  @ApiProperty({ 
    required: false,
    description: 'Номер сторінки',
    default: 1,
    minimum: 1
  })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ 
    required: false,
    description: 'Кількість записів на сторінці',
    default: 10,
    minimum: 1
  })
  @IsOptional()
  limit?: number = 10;
} 