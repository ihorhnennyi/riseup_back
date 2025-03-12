import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module'; // ✅ Добавляем AuthModule
import { User, UserSchema } from '../auth/schemas/user.schema';
import { UserModule } from '../user/user.module'; // ✅ Импортируем модуль пользователей
import { LeadService } from './lead.service';
import { LeadController } from './leads.controller';
import { Lead, LeadSchema } from './schemas/lead.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule, // ✅ Импортируем AuthModule, где находится JwtAuthGuard
    UserModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
