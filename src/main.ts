import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as express from 'express';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Используем cookieParser

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // ✅ ОБЯЗАТЕЛЬНО, иначе куки не работают
    allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
    exposedHeaders: ['X-XSRF-TOKEN'],
  });

  // Логируем куки для отладки
  app.use((req: Request, res: Response, next) => {
    console.log('Cookies:', req.cookies);
    next();
  });

  // Middleware для CSRF-защиты
  app.use(
    csurf({
      cookie: {
        key: '_csrf',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Игнорируем CSRF для безопасных запросов
    }),
  );

  // Эндпоинт для получения CSRF-токена
  app.use('/auth/csrf-token', (req: Request, res: Response) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false, // Доступен в JS
      secure: false,
      sameSite: 'lax',
    });
    return res.json({ csrfToken });
  });

  app.useGlobalPipes(new ValidationPipe());

  // Swagger-документация
  const config = new DocumentBuilder()
    .setTitle('RiseUP API')
    .setDescription('Документация API')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', name: 'X-XSRF-TOKEN', in: 'header' },
      'csrf-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      withCredentials: true,
      requestInterceptor: async (req) => {
        if (req.headers.cookie) {
          const cookies = req.headers.cookie.split('; ');
          const xsrfCookie = cookies.find((row) =>
            row.startsWith('XSRF-TOKEN='),
          );
          if (xsrfCookie) {
            req.headers['X-XSRF-TOKEN'] = xsrfCookie.split('=')[1];
          }
        }
        return req;
      },
    },
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(8000);
}

bootstrap();
