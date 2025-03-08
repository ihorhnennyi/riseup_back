import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh токен',
  })
  @IsString({ message: 'Refresh-токен должен быть строкой' })
  @IsNotEmpty({ message: 'Refresh-токен обязателен' })
  refreshToken: string;
}
