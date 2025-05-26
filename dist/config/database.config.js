"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('DatabaseConfig');
const getDatabaseConfig = async (configService) => {
    const uri = configService.get('database.uri');
    return {
        uri,
        connectionFactory: (connection) => {
            connection.on('connected', () => {
                logger.log('MongoDB успішно підключено');
            });
            connection.on('disconnected', () => {
                logger.warn('MongoDB відключено');
            });
            connection.on('error', (error) => {
                logger.error(`Помилка підключення до MongoDB: ${error.message}`, error.stack);
            });
            return connection;
        },
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map