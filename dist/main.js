"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const swagger_config_1 = require("./config/swagger.config");
async function bootstrap() {
    const logger = new common_1.Logger('Запуск');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.setGlobalPrefix('api/v1');
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        (0, swagger_config_1.setupSwagger)(app);
        const configService = app.get(config_1.ConfigService);
        const port = configService.get('PORT', 8000);
        app.use((req, res, next) => {
            logger.debug(`Вхідний ${req.method} запит до ${req.url}`);
            logger.debug(`Заголовки: ${JSON.stringify(req.headers)}`);
            next();
        });
        await app.listen(port);
        logger.log(`🚀 Сервер запущено на: http://localhost:${port}`);
        logger.log(`📝 Документація API доступна за адресою: http://localhost:${port}/api/v1`);
        logger.log(`🔥 Додаток працює в режимі ${configService.get('NODE_ENV', 'development')}`);
    }
    catch (error) {
        logger.error(`❌ Помилка запуску сервера: ${error.message}`, error.stack);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map