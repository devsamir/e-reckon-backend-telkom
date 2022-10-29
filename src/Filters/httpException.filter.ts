import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error: any = exception.getResponse();
    const message = Array.isArray(error.message)
      ? error.message[0]
      : error.message
      ? error.message
      : error;
    res.status(status).json({
      status: exception.getStatus(),
      message,
    });
  }
}
