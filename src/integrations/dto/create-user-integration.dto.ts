import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserIntegrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  integrationId: string;
} 