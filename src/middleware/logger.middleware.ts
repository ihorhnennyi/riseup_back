import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${userAgent} [${ip}]\n`;

      if (statusCode >= 400) {
        this.logger.warn(logMessage.trim());
      } else {
        this.logger.log(logMessage.trim());
      }
      this.writeLogToFile(logMessage);
    });

    next();
  }

  private writeLogToFile(message: string) {
    const logDir = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(path.join(logDir, 'requests.log'), message);
  }
}
