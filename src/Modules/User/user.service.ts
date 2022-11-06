import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: GetAllQuery) {
    const generatedQuery = generateQuery(query);
    const [length, data] = await Promise.all([
      this.prisma.user.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.prisma.user.findMany({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch((err) => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  get(id: number) {
    return this.prisma.user.findFirst({ where: { id, active: true } });
  }

  async create(body: CreateUserDto) {
    // Check if username is already in use
    const user = await this.prisma.user.findFirst({
      where: { username: body.username, active: true },
    });
    if (user) throw new BadRequestException('Username sudah dipakai');

    // Hash password using argon and than save it
    const hash = await argon.hash(body.password).catch(() => {
      throw new InternalServerErrorException('Gagal hashing password');
    });

    return this.prisma.user.create({ data: { ...body, password: hash } });
  }

  async update(id: number, body: UpdateUserDto) {
    // Check if user exist
    const oldUser = await this.prisma.user.findFirst({
      where: { id, active: true },
    });
    if (!oldUser) throw new BadRequestException('User tidak ditemukan');

    // Check if the username available
    if (body.username) {
      const isUsernameAlreadyInUse = await this.prisma.user.findFirst({
        where: {
          username: body.username,
          active: true,
          NOT: {
            id,
          },
        },
      });
      if (isUsernameAlreadyInUse)
        throw new BadRequestException('Username sudah dipakai');
    }

    const hash = body.password
      ? await argon.hash(body.password).catch(() => {
          throw new InternalServerErrorException('Gagal hashing password');
        })
      : oldUser.password;

    return this.prisma.user.update({
      where: { id },
      data: { ...body, password: hash },
    });
  }

  async delete(id: number) {
    // Check Super Admin
    const users = await this.prisma.user.findMany({
      where: { level: 99, active: true },
    });
    const superAdmin = users.find((user) => user.id === id);
    if (users.length <= 1 && superAdmin)
      throw new BadRequestException(
        'Minimal harus ada satu super admin di sistem',
      );

    // Check If User Exist

    return this.prisma.user
      .update({ where: { id }, data: { active: false } })
      .catch(() => {
        throw new BadRequestException('User tidak ditemukan');
      });
  }
}
