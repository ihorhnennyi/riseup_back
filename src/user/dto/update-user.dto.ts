import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserRole } from 'src/enum/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((id) => new Types.ObjectId(id)) : [],
  )
  leads?: Types.ObjectId[];

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value instanceof Types.ObjectId ? value.toString() : value,
  )
  branch?: string;
}
