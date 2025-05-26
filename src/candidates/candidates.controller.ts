import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Public } from '../common/decorators/public.decorator'
import { CandidatesService } from './candidates.service'
import { CreateCandidateDto } from './dto/create-candidate.dto'
import { UpdateCandidateDto } from './dto/update-candidate.dto'

@ApiTags('Кандидати')
@Controller('candidates')
@UseGuards(JwtAuthGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Public()
  @Post()
  @ApiOperation({ 
    summary: 'Створити кандидата', 
    description: 'Додає нового кандидата до системи. Обов\'язкові поля: firstName, lastName, createdBy, status.' 
  })
  @ApiBody({ 
    type: CreateCandidateDto,
    description: 'Дані для створення кандидата',
    examples: {
      example1: {
        value: {
          firstName: 'Іван',
          lastName: 'Петренко',
          middleName: 'Олександрович',
          email: 'ivan@example.com',
          phone: '+380501234567',
          age: 25,
          position: 'Frontend Developer',
          salary: 2000,
          city: '662f1f77bcf86cd799439011',
          source: '662f1f77bcf86cd799439012',
          description: 'Досвідчений розробник з 3 роками досвіду',
          createdBy: '507f1f77bcf86cd799439011',
          status: '662f1f77bcf86cd799439013',
          employmentType: 'Повна зайнятість',
          gender: 'Чоловік',
          isActive: true
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Кандидата створено.',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Іван',
        lastName: 'Петренко',
        // ... інші поля
        createdAt: '2024-03-20T10:00:00.000Z',
        updatedAt: '2024-03-20T10:00:00.000Z'
      }
    }
  })
  async create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Пошук і фільтрація кандидатів', 
    description: 'Гнучкий пошук і фільтрація кандидатів за різними параметрами.' 
  })
  @ApiQuery({ name: 'q', required: false, description: 'Пошук по імені, email, телефону' })
  @ApiQuery({ name: 'status', required: false, description: 'ID статусу' })
  @ApiQuery({ name: 'city', required: false, description: 'ID міста' })
  @ApiQuery({ name: 'source', required: false, description: 'ID джерела' })
  @ApiQuery({ name: 'assignedRecruiter', required: false, description: 'ID рекрутера' })
  @ApiQuery({ name: 'createdBy', required: false, description: 'ID автора' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Активний (true/false)' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Дата створення від (ISO)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Дата створення до (ISO)' })
  @ApiQuery({ name: 'page', required: false, description: 'Номер сторінки' })
  @ApiQuery({ name: 'limit', required: false, description: 'Кількість на сторінку' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список кандидатів з пагінацією',
    schema: {
      example: {
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            firstName: 'Іван',
            lastName: 'Петренко',
            // ... інші поля
          }
        ],
        total: 100,
        page: 1,
        totalPages: 5
      }
    }
  })
  async findAll(@Query() query: any) {
    return this.candidatesService.findAll(query);
  }

  @Public()
  @Get('check-duplicate')
  @ApiOperation({ summary: 'Перевірка дублікату кандидата', description: 'Перевіряє, чи існує кандидат з таким імʼям та прізвищем.' })
  @ApiQuery({ name: 'firstName', required: true, description: 'Імʼя кандидата' })
  @ApiQuery({ name: 'lastName', required: true, description: 'Прізвище кандидата' })
  @ApiResponse({ status: 200, description: 'Дублікат знайдено або не знайдено', schema: { example: { exists: true, candidate: { _id: '...', firstName: '...', lastName: '...' } } } })
  async checkDuplicate(@Query() query: any) {
    console.log('RAW QUERY:', query);
    const { firstName, lastName } = query;
    if (!firstName || !lastName) {
      throw new BadRequestException('firstName and lastName are required');
    }
    const candidate = await this.candidatesService.findDuplicateByName(firstName, lastName);
    return { exists: !!candidate, candidate };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Отримати кандидата за ID', 
    description: 'Повертає детальну інформацію про кандидата.' 
  })
  @ApiResponse({
    status: 200,
    description: 'Детальна інформація про кандидата',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Іван',
        lastName: 'Петренко',
        // ... інші поля
      }
    }
  })
  async findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Оновити кандидата', 
    description: 'Оновлює дані кандидата за ID. Всі поля є опціональними.' 
  })
  @ApiBody({ 
    type: UpdateCandidateDto,
    description: 'Дані для оновлення кандидата',
    examples: {
      example1: {
        value: {
          status: 'На співбесіді',
          callbackStatus: 'Заплановано',
          callbackDescription: 'Зателефонувати о 15:00',
          interviewDate: '2024-03-25T15:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Кандидата оновлено',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Іван',
        lastName: 'Петренко',
        status: 'На співбесіді',
        // ... оновлені поля
        updatedAt: '2024-03-20T11:00:00.000Z'
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Видалити кандидата', 
    description: 'Видаляє кандидата з системи за ID.' 
  })
  @ApiResponse({
    status: 200,
    description: 'Кандидата видалено',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Іван',
        lastName: 'Петренко',
        // ... інші поля
        deletedAt: '2024-03-20T12:00:00.000Z'
      }
    }
  })
  async remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Оновити статус кандидата', 
    description: 'Оновлює статус кандидата за ID.' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'ID нового статусу',
          example: '662f1f77bcf86cd799439013'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Статус кандидата оновлено',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Іван',
        lastName: 'Петренко',
        status: '662f1f77bcf86cd799439013',
        updatedAt: '2024-03-20T11:00:00.000Z'
      }
    }
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.candidatesService.updateStatus(id, status);
  }

  @Patch(':id/callback-status')
  async updateCallbackStatus(@Param('id') id: string, @Body('callbackStatus') callbackStatus: string) {
    return this.candidatesService.update(id, { callbackStatus });
  }

  @Patch(':id/source')
  async updateSource(@Param('id') id: string, @Body('source') source: string) {
    return this.candidatesService.update(id, { source });
  }
} 