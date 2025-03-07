import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshDto {
  @ApiProperty({
    example: 'refresh_token_example',
    description: 'Refresh токен',
  })
  refreshToken: string;
}
