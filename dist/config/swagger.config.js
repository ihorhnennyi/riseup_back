"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Rise Project API')
        .setDescription('Документація API проекту Rise. Всі ендпоінти версії v1 доступні за префіксом /api/v1.\n\nДля авторизації використовуйте JWT токен.\n\nБільше прикладів використання дивіться у розділах нижче.')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Будь ласка, введіть JWT токен',
    }, 'access-token')
        .addTag('Аутентифікація', 'Ендпоінти аутентифікації')
        .addTag('Користувачі', 'Ендпоінти управління користувачами')
        .addTag('Міста', 'Ендпоінти управління містами')
        .addTag('Статуси кандидатів', 'Ендпоінти управління статусами кандидатів')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            security: [{
                    'access-token': [],
                }],
        },
        customSiteTitle: 'Документація API проекту Rise',
    });
}
//# sourceMappingURL=swagger.config.js.map