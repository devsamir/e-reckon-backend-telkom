import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(PrismaClientValidationError)
export class PrismaErrorFilter implements ExceptionFilter {
  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    res.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
