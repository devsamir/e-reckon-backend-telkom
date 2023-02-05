import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';

import { generateQuery } from '../../Common/helpers';
import { UnitService } from '../Unit/unit.service';
import { User } from '../User/user.entity';

import { CreateItemDto, UpdateItemDto } from './item.dto';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private item: Repository<Item>,
    private unitService: UnitService,
  ) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    console.log({ where: generatedQuery.where });
    const [length, data] = await Promise.all([
      this.item.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.item.find({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.item.findOne({
      where: { id, active: true },
    });
  }

  async create(body: CreateItemDto, user: User) {
    //   // Check if unique key is already in use
    const item = await this.item.findOne({
      where: [
        { item_code: body.item_code, active: true },
        { material_designator: body.material_designator, active: true },
        { service_designator: body.service_designator, active: true },
      ],
    });

    if (item) {
      if (item.item_code === body.item_code)
        throw new BadRequestException('Item code sudah dipakai');

      if (item.material_designator === body.material_designator)
        throw new BadRequestException('Material designator sudah dipakai');

      if (item.service_designator === body.service_designator)
        throw new BadRequestException('Jasa designator sudah dipakai');
    }
    // Check if unit is valid
    const unit = await this.unitService.get(body.unit_id);

    if (!unit) throw new BadRequestException('Unit tidak valid');

    const newUnit = this.item.create({
      ...body,
      unit_id: { id: unit.id },
      created_by: { id: user.id },
    });

    return this.item.save(newUnit);
  }

  async update(id: number, body: UpdateItemDto, user: User) {
    // Check if item
    const oldItem = await this.item.findOne({
      where: { id, active: true },
    });

    if (!oldItem) throw new BadRequestException('Item tidak ditemukan');
    // Check if unique key is already in use
    const item = await this.item.findOne({
      where: [
        { item_code: body.item_code, active: true, id: Not(id) },
        {
          material_designator: body.material_designator,
          active: true,
          id: Not(id),
        },
        {
          service_designator: body.service_designator,
          active: true,
          id: Not(id),
        },
      ],
    });
    if (item) {
      if (item.item_code === body.item_code)
        throw new BadRequestException('Item code sudah dipakai');

      if (item.material_designator === body.material_designator)
        throw new BadRequestException('Material designator sudah dipakai');

      if (item.service_designator === body.service_designator)
        throw new BadRequestException('Jasa designator sudah dipakai');
    }
    if (body.unit_id) {
      // Check if item is valid
      const unit = await this.unitService.get(body.unit_id);

      if (!unit) throw new BadRequestException('Unit tidak valid');
    }

    return this.item.update(id, {
      ...body,
      unit_id: { id: body.unit_id },
      updated_by: { id: user.id },
      update_at: new Date(),
    });
  }

  async delete(ids: number[], user: User) {
    return this.item
      .update(ids, {
        active: false,
        deleted_by: { id: user.id },
        delete_at: new Date(),
      })
      .catch(() => {
        throw new BadRequestException('Item tidak ditemukan');
      });
  }
}
