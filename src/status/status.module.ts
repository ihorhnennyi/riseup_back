import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // ✅ Добавляем импорт JwtModule
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Status, StatusSchema } from './schemas/status.schema';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
    AuthModule,
    JwtModule.register({
      // ✅ Добавляем JwtModule
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
