import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { User } from 'src/Modules/User/user.entity';

import { AuthService } from '../Modules/Auth/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class AdminGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    // Authentication
    const req = context.switchToHttp().getRequest<Request>();
    const token: any = req.headers?.['token'];
    if (!token)
      throw new UnauthorizedException(
        'Token sudah kadaluarsa, silakan login lagi terlebih dahulu',
      );
    const user = await this.authService.validateToken(token);
    if (!user)
      throw new UnauthorizedException(
        'Anda tidak memiliki hak untuk melakukan aksi ini',
      );
    req.user = user;
    // Authorization
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    if (!roles.includes(user.role))
      throw new UnauthorizedException(
        'Anda tidak memiliki hak untuk melakukan aksi ini',
      );

    return true;
  }
}
