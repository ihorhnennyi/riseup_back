import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();
    let message = 'Щось пішло не так';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const resp = exceptionResponse as Record<string, unknown>;
      const msg = resp.message;
      if (Array.isArray(msg)) {
        message = msg.join(', ');
      } else if (typeof msg === 'string') {
        message = msg;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
