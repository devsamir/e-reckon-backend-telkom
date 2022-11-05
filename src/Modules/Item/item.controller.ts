import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { GetUser } from '../../Common/decorators/GetUser';
import { AdminGuard } from '../../Guards/admin.guard';
import {
  CreateItemDto,
  ExcludeGetAllItemDto,
  ExcludeItemDto,
  UpdateItemDto,
} from './item.dto';
import { ItemService } from './item.service';

@Controller('item')
@Serialize(ExcludeItemDto)
@UseGuards(AdminGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @HttpCode(200)
  @Post('/search_read')
  @Serialize(ExcludeGetAllItemDto)
  async getAllUnit(@Body() body: GetAllQuery) {
    return this.itemService.getAll(body);
  }

  @Post('/create')
  async createItem(@Body() body: CreateItemDto, @GetUser() user: User) {
    return this.itemService.create(body, user);
  }

  @Get('/read/:id')
  async getItem(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.get(id);
  }

  @Patch('/write/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateItemDto,
    @GetUser() user: User,
  ) {
    const unit = await this.itemService.update(id, body, user);
    return unit;
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteItem(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    await this.itemService.delete(id, user);
    return null;
  }
}
