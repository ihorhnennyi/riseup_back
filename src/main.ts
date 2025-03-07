import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // Убедитесь, что это совпадает с вашим клиентом
    credentials: true, // Включаем передачу куков
    allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
    exposedHeaders: ['X-XSRF-TOKEN'],
  });

  app.use((req, res, next) => {
    const swaggerUrls = ['/api/docs', '/api/docs-json', '/auth/csrf-token'];
    if (
      swaggerUrls.includes(req.originalUrl) ||
      req.originalUrl.startsWith('/api/docs')
    ) {
      return next();
    }
    next();
  });

  // CSRF Middleware
  app.use(
    csurf({
      cookie: {
        key: '_csrf',
        httpOnly: true,
        secure: false, // В dev-режиме false, на проде true
        sameSite: 'lax',
      },
    }),
  );

  // Middleware для отправки CSRF-токена клиенту
  app.use((req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });

    next();
  });

  app.useGlobalPipes(new ValidationPipe());

  // Swagger API Docs с `withCredentials: true`
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
            const xsrfToken = xsrfCookie.split('=')[1];
            req.headers['X-XSRF-TOKEN'] = xsrfToken;
          }
        }
        return req;
      },
    },
  });

  await app.listen(8000);
}

bootstrap();
