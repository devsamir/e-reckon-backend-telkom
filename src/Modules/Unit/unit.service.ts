import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

import { CreateUpdateUnitDto } from './unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    const [length, data] = await Promise.all([
      this.prisma.unit.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.prisma.unit.findMany({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.prisma.unit.findFirst({
      where: { id, active: true },
    });
  }

  async create(body: CreateUpdateUnitDto, user: User) {
    // Check if username is already in use
    const unit = await this.prisma.unit.findFirst({
      where: { unit_name: body.unit_name, active: true },
    });
    if (unit) throw new BadRequestException('Nama unit sudah dipakai');

    return this.prisma.unit.create({
      data: { unit_name: body.unit_name, created_by: user.id },
      include: { createdBy: true },
    });
  }

  async update(id: number, body: CreateUpdateUnitDto, user: User) {
    // Check if user exist
    const oldUnit = await this.prisma.unit.findFirst({
      where: { id, active: true },
    });
    if (!oldUnit) throw new BadRequestException('Unit tidak ditemukan');

    // Check if unit name available
    const isUnitAlreadyInUse = await this.prisma.unit.findFirst({
      where: {
        unit_name: body.unit_name,
        active: true,
        NOT: {
          id,
        },
      },
    });

    if (isUnitAlreadyInUse)
      throw new BadRequestException('Nama unit sudah dipakai');

    return this.prisma.unit.update({
      where: { id },
      data: {
        unit_name: body.unit_name,
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }

  async delete(ids: number[], user: User) {
    return this.prisma.unit
      .updateMany({
        where: { id: { in: ids } },
        data: { active: false, deleted_by: user.id, delete_at: new Date() },
      })
      .catch(() => {
        throw new BadRequestException('Unit tidak ditemukan');
      });
  }
}
