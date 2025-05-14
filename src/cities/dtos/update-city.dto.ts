import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCityDto {
  @ApiPropertyOptional({
    example: 'Львів',
    description: 'Оновлена назва міста українською або латинською',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Назва має бути текстом' })
  @MinLength(2, { message: 'Назва має містити не менше 2 символів' })
  @MaxLength(50, { message: 'Назва має містити не більше 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message:
      'Назва може містити лише літери (латинські або кириличні), пробіли та апострофи',
  })
  name?: string;
}
