import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { TestService } from './test.service';

@ApiTags('Тестові дані')
@Controller('test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('seed')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Згенерувати тестові дані', 
    description: 'Створює набір тестових даних для розробки та тестування. Доступно тільки для адміністраторів.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Тестові дані успішно створено',
    schema: {
      example: {
        message: 'Test data seeded successfully',
        counts: {
          cities: 5,
          branch: 1,
          statuses: 5,
          sources: 5,
          users: 2,
          candidates: 20
        }
      }
    }
  })
  async seedTestData() {
    return this.testService.seedTestData();
  }
} 