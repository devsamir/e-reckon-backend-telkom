import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { AdminGuard } from '../../Guards/admin.guard';
import {
  CreateUserDto,
  UpdateUserDto,
  ExcludeGetAllUserDto,
  ExcludeUserDto,
} from './user.dto';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
@UseGuards(AdminGuard)
@Serialize(ExcludeUserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Serialize(ExcludeGetAllUserDto)
  @Post('/search_read')
  async getAllUser(@Body() body: GetAllQuery) {
    const users = await this.userService.getAll(body);

    return users;
  }

  @Post('/create')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);

    return user;
  }

  @Get('/me')
  async getMyProfile(@Req() req: Request) {
    const user = await this.userService.get(req.user.id);

    return user;
  }

  @Get('/read/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.get(id);

    return user;
  }

  @Patch('/write/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, body);

    return user;
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return null;
  }
}
