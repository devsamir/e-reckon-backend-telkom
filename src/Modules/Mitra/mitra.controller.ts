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
  UseGuards,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { GetUser } from '../../Common/decorators/GetUser';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';

import {
  CreateMitraDto,
  ExcludeGetAllMitraDto,
  ExcludeMitraDto,
  UpdateMitraDto,
} from './mitra.dto';
import { MitraService } from './mitra.service';

@Controller('mitra')
@Serialize(ExcludeMitraDto)
@UseGuards(AdminGuard)
export class MitraController {
  constructor(private mitraService: MitraService) {}

  @HttpCode(200)
  @Post('/search_read')
  @Serialize(ExcludeGetAllMitraDto)
  async getAllUnit(@Body() body: GetAllQuery) {
    return this.mitraService.getAll(body);
  }

  @Post('/create')
  async createItem(@Body() body: CreateMitraDto, @GetUser() user: User) {
    return this.mitraService.create(body, user);
  }

  @Get('/read/:id')
  async getItem(@Param('id', ParseIntPipe) id: number) {
    return this.mitraService.get(id);
  }

  @Patch('/write/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMitraDto,
    @GetUser() user: User,
  ) {
    const unit = await this.mitraService.update(id, body, user);
    return unit;
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteItem(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    await this.mitraService.delete(id, user);
    return null;
  }
}