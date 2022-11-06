import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';
import { UnitService } from '../Unit/unit.service';

import { CreateItemDto, UpdateItemDto } from './item.dto';

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private unitService: UnitService,
  ) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    const [length, data] = await Promise.all([
      this.prisma.items.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.prisma.items.findMany({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.prisma.items.findFirst({
      where: { id, active: true },
    });
  }

  async create(body: CreateItemDto, user: User) {
    //   // Check if unique key is already in use
    const item = await this.prisma.items.findFirst({
      where: {
        OR: [
          { item_code: body.item_code },
          { material_designator: body.material_designator },
          { service_designator: body.service_designator },
        ],
        active: true,
      },
    });

    if (item) {
      if (item.item_code === body.item_code)
        throw new BadRequestException('Item code sudah dipakai');

      if (item.material_designator === body.material_designator)
        throw new BadRequestException('Material designator sudah dipakai');

      if (item.service_designator === body.service_designator)
        throw new BadRequestException('Service designator sudah dipakai');
    }
    // Check if unit is valid
    const unit = await this.unitService.get(body.unit_id);

    if (!unit) throw new BadRequestException('Unit tidak valid');

    return this.prisma.items.create({
      data: { ...body, created_by: user.id },
    });
  }

  async update(id: number, body: UpdateItemDto, user: User) {
    // Check if item
    const oldItem = await this.prisma.items.findFirst({
      where: { id, active: true },
    });

    if (!oldItem) throw new BadRequestException('Item tidak ditemukan');
    // Check if unique key is already in use
    const item = await this.prisma.items.findFirst({
      where: {
        OR: [
          { item_code: body.item_code },
          { material_designator: body.material_designator },
          { service_designator: body.service_designator },
        ],
        active: true,
        NOT: {
          id,
        },
      },
    });
    if (item) {
      if (item.item_code === body.item_code)
        throw new BadRequestException('Item code sudah dipakai');

      if (item.material_designator === body.material_designator)
        throw new BadRequestException('Material designator sudah dipakai');

      if (item.service_designator === body.service_designator)
        throw new BadRequestException('Service designator sudah dipakai');
    }
    if (body.unit_id) {
      // Check if item is valid
      const unit = await this.unitService.get(body.unit_id);

      if (!unit) throw new BadRequestException('Unit tidak valid');
    }

    return this.prisma.items.update({
      where: { id },
      data: { ...body, updated_by: user.id, update_at: new Date() },
    });
  }

  async delete(id: number, user: User) {
    return this.prisma.items
      .update({
        where: { id },
        data: { active: false, deleted_by: user.id, delete_at: new Date() },
      })
      .catch(() => {
        throw new BadRequestException('Item tidak ditemukan');
      });
  }
}
