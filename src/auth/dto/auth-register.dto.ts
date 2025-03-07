import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enum/user-role.enum';

export class AuthRegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @Transform(({ value }) => value as UserRole) // Преобразуем строку в enum
  @IsEnum(UserRole, { message: 'role must be a valid UserRole' })
  role?: UserRole;
}
