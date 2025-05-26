import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './schemas/branch.schema';

@ApiTags('Філії')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нову філію', description: 'Доступно тільки для адміністраторів та супер-адміністраторів' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Філію успішно створено',
    type: Branch
  })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати всі активні філії' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список всіх активних філій',
    type: [Branch]
  })
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати філію за ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Філію знайдено',
    type: Branch
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Філію не знайдено'
  })
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оновити філію', description: 'Доступно тільки для адміністраторів та супер-адміністраторів' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Філію успішно оновлено',
    type: Branch
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Філію не знайдено'
  })
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Видалити філію', description: 'Доступно тільки для адміністраторів та супер-адміністраторів' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Філію успішно видалено',
    type: Branch
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Філію не знайдено'
  })
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
} 