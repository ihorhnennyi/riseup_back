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
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
    exposedHeaders: ['X-XSRF-TOKEN'],
  });

  app.use((req, res, next) => {
    console.log('Cookies:', req.cookies);
    next();
  });

  app.use(
    csurf({
      cookie: {
        key: '_csrf',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  app.use((req, res, next) => {
    if (req.method === 'GET' && req.originalUrl === '/auth/csrf-token') {
      const csrfToken = req.csrfToken();
      res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      });
      return res.json({ csrfToken });
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe());

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

  await app.listen(8000);
}

bootstrap();
