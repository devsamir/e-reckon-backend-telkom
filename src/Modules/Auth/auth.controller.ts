import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const token = await this.authService.login(body);

    return { token };
  }
}
