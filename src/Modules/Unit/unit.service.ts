import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@prisma/client';
import { Not, Repository } from 'typeorm';

import { generateQuery } from '../../Common/helpers';

import { CreateUpdateUnitDto } from './unit.dto';
import { Unit } from './unit.entity';

@Injectable()
export class UnitService {
  constructor(@InjectRepository(Unit) private unit: Repository<Unit>) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);

    const [length, data] = await Promise.all([
      this.unit.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.unit.find({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.unit.findOne({
      where: { id, active: true },
    });
  }

  async create(body: CreateUpdateUnitDto, user: User) {
    // Check if username is already in use
    const unit = await this.unit.findOne({
      where: { unit_name: body.unit_name, active: true },
    });
    if (unit) throw new BadRequestException('Nama unit sudah dipakai');

    const newUnit = this.unit.create({
      unit_name: body.unit_name,
      created_by: { id: user.id },
    });

    return this.unit.save(newUnit);
  }

  async update(id: number, body: CreateUpdateUnitDto, user: User) {
    // Check if user exist
    const oldUnit = await this.unit.findOne({
      where: { id, active: true },
    });
    if (!oldUnit) throw new BadRequestException('Unit tidak ditemukan');

    // Check if unit name available
    const isUnitAlreadyInUse = await this.unit.findOne({
      where: {
        unit_name: body.unit_name,
        active: true,
        id: Not(id),
      },
    });

    if (isUnitAlreadyInUse)
      throw new BadRequestException('Nama unit sudah dipakai');

    return this.unit.update(id, {
      unit_name: body.unit_name,
      updated_by: { id: user.id },
      update_at: new Date(),
    });
  }

  async delete(ids: number[], user: User) {
    return this.unit
      .update(ids, {
        active: false,
        deleted_by: { id: user.id },
        delete_at: new Date(),
      })
      .catch(() => {
        throw new BadRequestException('Unit tidak ditemukan');
      });
  }
}
