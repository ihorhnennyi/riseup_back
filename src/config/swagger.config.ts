import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Rise Project API')
    .setDescription('Документація API проекту Rise. Всі ендпоінти версії v1 доступні за префіксом /api/v1.\n\nДля авторизації використовуйте JWT токен.\n\nБільше прикладів використання дивіться у розділах нижче.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Будь ласка, введіть JWT токен',
      },
      'access-token',
    )
    .addTag('Аутентифікація', 'Ендпоінти аутентифікації')
    .addTag('Користувачі', 'Ендпоінти управління користувачами')
    .addTag('Міста', 'Ендпоінти управління містами')
    .addTag('Статуси кандидатів', 'Ендпоінти управління статусами кандидатів')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      security: [{
        'access-token': [],
      }],
    },
    customSiteTitle: 'Документація API проекту Rise',
  });
} 