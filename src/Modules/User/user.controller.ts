import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { Roles } from '../../Common/decorators/Roles';
import { DeleteDataDto } from '../../Common/dtos/deleteDataDto';
import {
  ExcludePasswordDto,
  ExcludePasswordGetAllDto,
} from '../../Common/dtos/excludePasswordDto';
import { GetAllQueryDto } from '../../Common/dtos/getAllDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';

import { CreateUserDto, UpdateProfileDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AdminGuard)
@Serialize(ExcludePasswordDto)
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Serialize(ExcludePasswordGetAllDto)
  @Post('/search_read')
  async getAllUser(@Body() body: GetAllQueryDto) {
    const users = await this.userService.getAll(body);

    return users;
  }

  @Roles('admin')
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

  @Post('/update-me/:id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileDto,
  ) {
    const user = await this.userService.updateProfile(id, body);

    return user;
  }

  @Get('/read/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.get(id);

    return user;
  }

  @Roles('admin')
  @Patch('/write/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, body);

    return user;
  }

  @Roles('admin')
  @HttpCode(204)
  @Post('/delete')
  async deleteUser(@Body() body: DeleteDataDto) {
    await this.userService.delete(body.ids);
    return null;
  }
}
