import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

import { Datel } from './datel.entity';

@Injectable()
export class DatelService {
  constructor(@InjectRepository(Datel) private datel: Repository<Datel>) {}

  async getAll(query: GetAllQuery) {
    const generatedQuery = generateQuery(query);
    const [length, data] = await Promise.all([
      this.datel.count({
        where: generatedQuery.where,
      }),
      this.datel.find({
        ...generatedQuery,
        where: generatedQuery.where,
      }),
    ]).catch((err) => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  get(id: number) {
    return this.datel.findOne({ where: { id } });
  }
}
