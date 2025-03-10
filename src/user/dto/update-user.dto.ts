import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  birthDate?: Date;
}
