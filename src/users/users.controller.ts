import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CandidatesService } from '../candidates/candidates.service'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Public } from '../common/decorators/public.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/enums/role.enum'
import { RolesGuard } from '../common/guards/roles.guard'
import { CreateSuperAdminDto } from './dto/create-super-admin.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserResponse } from './interfaces/user-response.interface'
import { UsersService } from './users.service'

@ApiTags('Користувачі')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly candidatesService: CandidatesService,
  ) {}

  @Public()
  @Post('super-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Створити супер-адміністратора', 
    description: 'Створення першого супер-адміністратора системи (одноразова операція)' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Супер-адміністратора успішно створено',
    type: UserResponse 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Супер-адміністратор вже існує або email зайнятий'
  })
  async createSuperAdmin(@Body() createSuperAdminDto: CreateSuperAdminDto): Promise<UserResponse> {
    return this.usersService.createSuperAdmin(createSuperAdminDto);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Створити нового користувача', 
    description: 'Створення нового користувача (доступно тільки для адміністраторів)' 
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Користувача успішно створено',
    type: UserResponse
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      message: 'Користувача успішно створено',
      data: user,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Отримати список користувачів', 
    description: 'Отримати список користувачів з можливістю фільтрації та пагінації' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список користувачів успішно отримано',
    type: UserResponse
  })
  findAll(@Query() filterDto: GetUsersFilterDto, @CurrentUser() currentUser: User) {
    return this.usersService.findAll(filterDto, currentUser.role);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Отримати користувача за ID', 
    description: 'Отримати детальну інформацію про конкретного користувача' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Користувача знайдено',
    type: UserResponse
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Оновити користувача', 
    description: 'Оновити інформацію про користувача (доступно тільки для адміністраторів)' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Користувача успішно оновлено',
    type: UserResponse
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оновити користувача (PATCH)', description: 'Оновити інформацію про користувача (частково)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Користувача успішно оновлено', type: UserResponse })
  updatePatch(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Видалити користувача', 
    description: 'Видалити користувача з системи (доступно тільки для адміністраторів)' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Користувача успішно видалено',
    type: UserResponse
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/candidates')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати кандидатів рекрутера', description: 'Повертає всіх кандидатів, у яких createdBy = :id.' })
  @ApiResponse({ status: 200, description: 'Список кандидатів рекрутера.' })
  async getCandidatesByRecruiter(@Param('id') id: string) {
    return this.candidatesService.findAll({ createdBy: id });
  }
} 