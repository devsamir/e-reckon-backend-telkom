import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';

import { generateQuery } from '../../Common/helpers';
import { User } from '../User/user.entity';

import { CreateUpdateJobTypeDto } from './jobType.dto';
import { JobType } from './jobType.entity';

@Injectable()
export class JobTypeService {
  constructor(
    @InjectRepository(JobType) private jobType: Repository<JobType>,
  ) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    const [length, data] = await Promise.all([
      this.jobType.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.jobType.find({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.jobType.findOne({
      where: { id, active: true },
    });
  }

  async create(body: CreateUpdateJobTypeDto, user: User) {
    // Check if username is already in use
    const unit = await this.jobType.findOne({
      where: { name: body.name, active: true },
    });
    if (unit)
      throw new BadRequestException('Nama jenis pekerjaan sudah dipakai');

    const newJobType = this.jobType.create({
      name: body.name,
      created_by: { id: user.id },
    });

    return this.jobType.save(newJobType);
  }

  async update(id: number, body: CreateUpdateJobTypeDto, user: User) {
    // Check if user exist
    const oldUnit = await this.jobType.findOne({
      where: { id, active: true },
    });
    if (!oldUnit)
      throw new BadRequestException('Jenis pekerjaan tidak ditemukan');

    // Check if unit name available
    const isUnitAlreadyInUse = await this.jobType.findOne({
      where: {
        name: body.name,
        active: true,
        id: Not(id),
      },
    });

    if (isUnitAlreadyInUse)
      throw new BadRequestException('Nama jenis pekerjaan sudah dipakai');

    return this.jobType.update(id, {
      name: body.name,
      updated_by: { id: user.id },
      update_at: new Date(),
    });
  }

  async delete(ids: number[], user: User) {
    return this.jobType
      .update(ids, {
        active: false,
        deleted_by: { id: user.id },
        delete_at: new Date(),
      })
      .catch(() => {
        throw new BadRequestException('Jenis pekerjaan tidak ditemukan');
      });
  }
}
