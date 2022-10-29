import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { generateQuery, catchAsync } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getAll = catchAsync(async (query: GetAllQuery) => {
    const generatedQuery = generateQuery(query);
    const [length, data] = await Promise.all([
      this.prisma.user.count({ where: generatedQuery.where }),
      this.prisma.user.findMany(generatedQuery),
    ]);

    return { length, data };
  });

  get = catchAsync(async (id: number) => {
    return this.prisma.user.findUnique({ where: { id } });
  });

  create = catchAsync(async (body: CreateUserDto) => {
    // Check if username is already in use
    const user = await this.prisma.user.findUnique({
      where: { username: body.username },
    });
    if (user) throw new BadRequestException('Username sudah dipakai');

    // Hash password using argon and than save it
    const hash = await argon.hash(body.password);

    return this.prisma.user.create({ data: { ...body, password: hash } });
  });

  update = catchAsync(async (id: number, body: UpdateUserDto) => {
    // Check if user exist
    const oldUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!oldUser) throw new BadRequestException('User tidak ditemukan');

    // Check if the username available
    if (body.username) {
      const isUsernameAlreadyInUse = await this.prisma.user.findFirst({
        where: {
          username: body.username,
          NOT: {
            id,
          },
        },
      });
      if (isUsernameAlreadyInUse)
        throw new BadRequestException('Username sudah dipakai');
    }

    const hash = body.password
      ? await argon.hash(body.password)
      : oldUser.password;

    return this.prisma.user.update({
      where: { id },
      data: { ...body, password: hash },
    });
  });

  delete = catchAsync(async (id: number) => {
    // Check Super Admin
    const users = await this.prisma.user.findMany({ where: { level: 99 } });
    const superAdmin = users.find((user) => user.id === id);
    if (users.length <= 1 && superAdmin)
      throw new BadRequestException(
        'Minimal harus ada satu super admin di sistem',
      );

    // Check If User Exist
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    return this.prisma.user.delete({ where: { id } });
  });
}
