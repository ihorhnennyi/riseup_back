import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModuleOptions } from '@nestjs/mongoose'

const logger = new Logger('DatabaseConfig');

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('database.uri');

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