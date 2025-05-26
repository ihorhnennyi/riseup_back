import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User found' })
  message: string;

  @ApiProperty({ type: () => User })
  data: Partial<User>;

  @ApiProperty({ 
    example: null,
    nullable: true,
    description: 'Error message if operation failed'
  })
  error?: string;
} 