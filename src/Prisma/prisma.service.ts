import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      errorFormat: 'minimal',
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}
