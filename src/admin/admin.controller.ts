import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Get()
  @Roles(UserRole.ADMIN)
  getAdminData() {
    console.log('Admin route accessed');
    return { message: 'Welcome, Admin!' };
  }
}
