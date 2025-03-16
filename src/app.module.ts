import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { BranchModule } from './branches/branch.module';
import { CityModule } from './city/city.module';
import { IntegrationModule } from './integration/integration.module';
import { LeadModule } from './lead/lead.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { StatusModule } from './status/status.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    AdminModule,

    // ✅ Корректный способ регистрации JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10d' },
      }),
    }),

    // ✅ Исправленный ThrottlerModule
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // ✅ Время в **миллисекундах** (60 сек)
          limit: 30, // ✅ Количество запросов за `ttl`
        },
      ],
    }),

    LeadModule,
    UserModule,
    CityModule,
    StatusModule,
    IntegrationModule,
    BranchModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
