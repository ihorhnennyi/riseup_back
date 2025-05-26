import { ApiProperty } from '@nestjs/swagger'

export class ApiResponse<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ example: null, nullable: true })
  data?: T;

  @ApiProperty({ example: null, nullable: true })
  error?: string;
}

export class PaginatedResponse<T> extends ApiResponse<T[]> {
  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
} 