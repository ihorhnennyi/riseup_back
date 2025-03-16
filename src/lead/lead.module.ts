import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { LeadService } from './lead.service';
import { LeadController } from './leads.controller';
import { LeadSchema } from './schemas/lead.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lead', schema: LeadSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule, // ✅ Импортируем, чтобы использовать `JwtAuthGuard`
    UserModule, // ✅ Используем `populate('recruiter')`
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
