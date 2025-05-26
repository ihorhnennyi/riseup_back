import { ApiProperty } from '@nestjs/swagger'

export class ApiResponse<T = any> {
  @ApiProperty({ 
    example: true,
    description: 'Статус виконання операції'
  })
  success: boolean;

  @ApiProperty({ 
    example: 'Операцію успішно виконано',
    description: 'Повідомлення про результат операції'
  })
  message: string;

  @ApiProperty({ 
    example: null, 
    nullable: true,
    description: 'Дані, повернуті в результаті операції'
  })
  data?: T;

  @ApiProperty({ 
    example: null, 
    nullable: true,
    description: 'Повідомлення про помилку (якщо виникла)'
  })
  error?: string;
} 