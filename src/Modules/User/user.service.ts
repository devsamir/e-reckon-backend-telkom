import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcryptjs';
import { Not, Repository } from 'typeorm';

import { generateQuery } from '../../Common/helpers';

import { CreateUserDto, UpdateProfileDto, UpdateUserDto } from './user.dto';
import { Role, User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private user: Repository<User>) {}

  async getAll(query: GetAllQuery) {
    const generatedQuery = generateQuery(query);
    const [length, data] = await Promise.all([
      this.user.count({
        where: { ...generatedQuery.where, active: true },
      }),
      this.user.find({
        ...generatedQuery,
        where: { ...generatedQuery.where, active: true },
      }),
    ]).catch((err) => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.user.findOne({ where: { id, active: true } });
  }

  async getByUsername(username: string) {
    return this.user.findOne({
      where: { username, active: true },
    });
  }

  async create(body: CreateUserDto) {
    // Check if username is already in use
    const user = await this.user.findOne({
      where: { username: body.username, active: true },
    });
    if (user) throw new BadRequestException('Username sudah dipakai');

    // Hash password using argon and than save it
    const hash = await bcrypt.hash(body.password, 10).catch(() => {
      throw new InternalServerErrorException('Gagal hashing password');
    });

    const newUser = this.user.create({ ...body, password: hash });
    return this.user.save(newUser);
  }

  async update(id: number, body: UpdateUserDto) {
    // Check if user exist
    const oldUser = await this.user.findOne({
      where: { id, active: true },
    });
    if (!oldUser) throw new BadRequestException('User tidak ditemukan');

    // Check if the username available
    if (body.username) {
      const isUsernameAlreadyInUse = await this.user.findOne({
        where: {
          username: body.username,
          active: true,
          id: Not(id),
        },
      });
      if (isUsernameAlreadyInUse)
        throw new BadRequestException('Username sudah dipakai');
    }

    const hash = body.password
      ? await bcrypt.hash(body.password, 10).catch(() => {
          throw new InternalServerErrorException('Gagal hashing password');
        })
      : oldUser.password;

    return this.user.update(id, { ...body, password: hash });
  }

  async updateProfile(id: number, body: UpdateProfileDto) {
    // Check if user exist
    const oldUser = await this.user.findOne({
      where: { id, active: true },
    });
    if (!oldUser) throw new BadRequestException('User tidak ditemukan');

    if (body.password_old || body.password_new) {
      const isOldPasswordCorrect = await bcrypt.compare(
        body.password_old,
        oldUser.password,
      );
      if (!isOldPasswordCorrect)
        throw new BadRequestException('Password Lama Salah');
    }

    const hash = body.password_new
      ? await bcrypt.hash(body.password_new, 10).catch(() => {
          throw new InternalServerErrorException('Gagal hashing password');
        })
      : oldUser.password;

    return this.user.update(id, { fullname: body.fullname, password: hash });
  }
  async delete(ids: number[]) {
    // Check Super Admin
    const users = await this.user.find({
      where: { role: Role.ADMIN, active: true },
    });

    const superAdmin = users.filter((user) => ids.includes(user.id));
    if (superAdmin.length >= 1 && users.length === superAdmin.length)
      throw new BadRequestException(
        'Minimal harus ada satu super admin di sistem',
      );

    // Check If User Exist

    return this.user.update(ids, { active: false });
  }
}
