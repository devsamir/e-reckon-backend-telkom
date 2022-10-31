import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateMitraDto, UpdateMitraDto } from './mitra.dto';

@Injectable()
export class MitraService {
  constructor(private prisma: PrismaService) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    const [length, data] = await Promise.all([
      this.prisma.mitra.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.prisma.mitra.findMany({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.prisma.mitra.findFirst({
      where: { id, active: true },
    });
  }

  async create(body: CreateMitraDto, user: User) {
    //   // Check if unique key is already in use
    const mitra = await this.prisma.mitra.findFirst({
      where: {
        OR: [{ shortname: body.shortname }, { fullname: body.fullname }],
        active: true,
      },
    });

    if (mitra) {
      if (mitra.shortname === body.shortname)
        throw new BadRequestException('Nama pendek sudah dipakai');

      if (mitra.fullname === body.fullname)
        throw new BadRequestException('Nama panjang sudah dipakai');
    }
    return this.prisma.mitra.create({
      data: { ...body, created_by: user.id },
    });
  }

  async update(id: number, body: UpdateMitraDto, user: User) {
    // Check if data exist
    const oldMitra = await this.prisma.mitra.findFirst({
      where: { id, active: true },
    });

    if (!oldMitra) throw new BadRequestException('Mitra tidak ditemukan');
    // Check if unique key is already in use
    const mitra = await this.prisma.mitra.findFirst({
      where: {
        OR: [{ shortname: body.shortname }, { fullname: body.fullname }],
        active: true,
        NOT: {
          id,
        },
      },
    });
    if (mitra) {
      if (mitra.shortname === body.shortname)
        throw new BadRequestException('Nama pendek sudah dipakai');

      if (mitra.fullname === body.fullname)
        throw new BadRequestException('Nama panjang sudah dipakai');
    }

    return this.prisma.mitra.update({
      where: { id },
      data: { ...body, updated_by: user.id, update_at: new Date() },
    });
  }

  async delete(id: number, user: User) {
    return this.prisma.mitra
      .update({
        where: { id },
        data: { active: false, deleted_by: user.id, delete_at: new Date() },
      })
      .catch(() => {
        throw new BadRequestException('Mitra tidak ditemukan');
      });
  }
}
