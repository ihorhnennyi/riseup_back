import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import envConfig from './config/env';
import { envSchema } from './config/env.validation';

import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CitiesModule } from './cities/cities.module';
import { DatabaseModule } from './database/database.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { SourcesModule } from './source/source.module';
import { StatusesModule } from './statuses/statuses.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validate(config: Record<string, unknown>) {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          console.error(
            '❌ Ошибка валидации .env:',
            result.error.flatten().fieldErrors,
          );
          throw new Error('Некорректные переменные окружения');
        }
        return result.data;
      },
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    CandidatesModule,
    CitiesModule,
    BranchesModule,
    StatusesModule,
    IntegrationsModule,
    SourcesModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('✅ Система успішно завантажена!');
  }
}
