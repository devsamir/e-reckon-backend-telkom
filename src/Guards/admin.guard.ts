import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';
import { AuthService } from '../Modules/Auth/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class AdminGuard implements CanActivate {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token: any = req.headers?.['token'];
    if (!token)
      throw new UnauthorizedException(
        'Token sudah kadaluarsa, silakan login lagi terlebih dahulu',
      );
    const user = await this.authService.validateToken(token);
    if (!user)
      throw new UnauthorizedException(
        'anda tidak memiliki hak untuk melakukan aksi ini',
      );
    req.user = user;
    return true;
  }
}
