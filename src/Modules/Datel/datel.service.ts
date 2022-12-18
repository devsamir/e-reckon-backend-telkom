import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class DatelService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: GetAllQuery) {
    const generatedQuery = generateQuery(query);
    const [length, data] = await Promise.all([
      this.prisma.datel.count({
        where: generatedQuery.where,
      }),
      this.prisma.datel.findMany({
        ...generatedQuery,
        where: generatedQuery.where,
      }),
    ]).catch((err) => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  get(id: number) {
    return this.prisma.datel.findFirst({ where: { id } });
  }
}
