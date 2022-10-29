import { InternalServerErrorException } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime';

export const catchAsync =
  (fn) =>
  async (...params) => {
    try {
      return await fn(...params);
    } catch (e) {
      console.log(e);
      if (e instanceof PrismaClientValidationError) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw new InternalServerErrorException(e.message);
    }
  };
