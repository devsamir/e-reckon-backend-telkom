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
} from '@nestjs/common';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import {
  CreateUserDto,
  UpdateUserDto,
  ExcludeGetAllUserDto,
  ExcludeUserDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Serialize(ExcludeGetAllUserDto)
  @Get('/')
  async getAllUser(@Body() body: GetAllQuery) {
    const users = await this.userService.getAll(body);

    return users;
  }

  @Serialize(ExcludeUserDto)
  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);

    return user;
  }

  @Serialize(ExcludeUserDto)
  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const users = await this.userService.get(id);

    return users;
  }

  @Serialize(ExcludeUserDto)
  @Patch('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, body);

    return user;
  }

  @HttpCode(204)
  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return null;
  }
}
