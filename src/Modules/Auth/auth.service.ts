import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as argon from 'argon2';

import { PrismaService } from '../../Prisma/prisma.service';
import { UserService } from '../User/user.service';

import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { username: body.username, active: true },
    });
    if (!user) throw new BadRequestException('Username atau password salah');
    const checkPassword = await argon
      .verify(user.password, body.password)
      .catch(() => {
        throw new InternalServerErrorException('Gagal compare password');
      });

    if (!checkPassword)
      throw new BadRequestException('Username atau password salah');

    // Generate Token Berdasarkan ID User
    const token = this.jwtService.sign({ id: user.id });
    return token;
  }

  async validateToken(token) {
    const decodedToken = await this.jwtService.verifyAsync(token).catch(() => {
      throw new UnauthorizedException(
        'Token sudah kadaluarsa, silakan login lagi terlebih dahulu',
      );
    });
    const user = await this.userService.get(decodedToken.id);
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    return user;
  }
}
