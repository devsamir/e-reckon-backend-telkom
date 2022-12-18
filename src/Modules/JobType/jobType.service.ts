import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

import { CreateUpdateJobTypeDto } from './jobType.dto';

@Injectable()
export class JobTypeService {
  constructor(private prisma: PrismaService) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    const [length, data] = await Promise.all([
      this.prisma.jobType.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.prisma.jobType.findMany({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.prisma.jobType.findFirst({
      where: { id, active: true },
    });
  }

  async create(body: CreateUpdateJobTypeDto, user: User) {
    // Check if username is already in use
    const unit = await this.prisma.jobType.findFirst({
      where: { name: body.name, active: true },
    });
    if (unit)
      throw new BadRequestException('Nama jenis pekerjaan sudah dipakai');

    return this.prisma.jobType.create({
      data: { name: body.name, created_by: user.id },
      include: { createdBy: true },
    });
  }

  async update(id: number, body: CreateUpdateJobTypeDto, user: User) {
    // Check if user exist
    const oldUnit = await this.prisma.jobType.findFirst({
      where: { id, active: true },
    });
    if (!oldUnit)
      throw new BadRequestException('Jenis pekerjaan tidak ditemukan');

    // Check if unit name available
    const isUnitAlreadyInUse = await this.prisma.jobType.findFirst({
      where: {
        name: body.name,
        active: true,
        NOT: {
          id,
        },
      },
    });

    if (isUnitAlreadyInUse)
      throw new BadRequestException('Nama jenis pekerjaan sudah dipakai');

    return this.prisma.jobType.update({
      where: { id },
      data: {
        name: body.name,
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }

  async delete(ids: number[], user: User) {
    return this.prisma.jobType
      .updateMany({
        where: { id: { in: ids } },
        data: { active: false, deleted_by: user.id, delete_at: new Date() },
      })
      .catch(() => {
        throw new BadRequestException('Jenis pekerjaan tidak ditemukan');
      });
  }
}
