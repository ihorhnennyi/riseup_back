import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
