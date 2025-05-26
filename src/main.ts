import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { setupSwagger } from './config/swagger.config'

async function bootstrap() {
  const logger = new Logger('Запуск');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable CORS
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // Global filters and pipes
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // Setup Swagger documentation
    setupSwagger(app);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 8000);

    // Включаємо детальне логування запитів
    app.use((req, res, next) => {
      logger.debug(`Вхідний ${req.method} запит до ${req.url}`);
      logger.debug(`Заголовки: ${JSON.stringify(req.headers)}`);
      next();
    });

    await app.listen(port);
    
    logger.log(`🚀 Сервер запущено на: http://localhost:${port}`);
    logger.log(`📝 Документація API доступна за адресою: http://localhost:${port}/api/v1`);
    logger.log(`🔥 Додаток працює в режимі ${configService.get('NODE_ENV', 'development')}`);
  } catch (error) {
    logger.error(`❌ Помилка запуску сервера: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
