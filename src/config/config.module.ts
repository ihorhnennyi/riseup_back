import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigController } from './config.controller';
import envConfig from './env';
import { envSchema } from './env.validation';

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
  ],
  controllers: [ConfigController],
})
export class ConfigAppModule {}
