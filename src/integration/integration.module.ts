import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module'; // ✅ Добавь импорт
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { Integration, IntegrationSchema } from './schema/integration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Integration.name, schema: IntegrationSchema },
    ]),
    AuthModule, // ✅ Добавь AuthModule
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
