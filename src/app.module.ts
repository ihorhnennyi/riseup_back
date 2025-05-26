import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { AnalyticsModule } from './analytics/analytics.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { BranchesModule } from './branches/branches.module'
import { CandidatesModule } from './candidates/candidates.module'
import { CitiesModule } from './cities/cities.module'
import { RolesGuard } from './common/guards/roles.guard'
import configuration from './config/configuration'
import { getDatabaseConfig } from './config/database.config'
import telegramConfig from './config/telegram.config'
import { IntegrationsModule } from './integrations/integrations.module'
import { SourcesModule } from './sources/sources.module'
import { StatusesModule } from './statuses/statuses.module'
import { TelegramModule } from './telegram/telegram.module'
import { TestModule } from './test/test.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration, telegramConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CitiesModule,
    StatusesModule,
    BranchesModule,
    IntegrationsModule,
    CandidatesModule,
    SourcesModule,
    TestModule,
    TelegramModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
