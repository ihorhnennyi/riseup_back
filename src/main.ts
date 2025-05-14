import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  loadEnv();
  validateEnv();

  const app = await NestFactory.create(AppModule);

  setupCors(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  setupSwagger(app);

  const port = Number(process.env.PORT) || 8000;
  await app.listen(port, '0.0.0.0');

  logServerInfo(port);
}

bootstrap().catch((err) => {
  console.error('❌ Ошибка при запуске приложения:', err);
});

function loadEnv() {
  dotenv.config();
}

function validateEnv() {
  const requiredVars = ['JWT_SECRET', 'MONGO_URI'];
  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(`❌ .env ошибка: переменная ${key} обязательна!`);
    }
  }

  if (process.env.PORT && isNaN(Number(process.env.PORT))) {
    throw new Error('❌ .env ошибка: PORT должен быть числом!');
  }
}

function setupCors(app: INestApplication) {
  app.enableCors({
    origin: ['http://localhost:5173', 'http://workriseup.website'],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET, POST, PATCH, DELETE',
  });
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CRM API')
    .setDescription('📜 Документація API для CRM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

function logServerInfo(port: number) {
  console.log(`🚀 Сервер запущен: http://localhost:${port}`);
  console.log(`📘 Swagger Docs: http://localhost:${port}/api/docs`);
}
