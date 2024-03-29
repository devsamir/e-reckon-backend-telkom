import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '../../Common/decorators/GetUser';
import { Roles } from '../../Common/decorators/Roles';
import { DeleteDataDto } from '../../Common/dtos/deleteDataDto';
import {
  ExcludePasswordDto,
  ExcludePasswordGetAllDto,
} from '../../Common/dtos/excludePasswordDto';
import { GetAllQueryDto } from '../../Common/dtos/getAllDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { User } from '../User/user.entity';

import { CreateItemDto, UpdateItemDto } from './item.dto';
import { ItemService } from './item.service';

@Controller('item')
@Serialize(ExcludePasswordDto)
@UseGuards(AdminGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @HttpCode(200)
  @Post('/search_read')
  @Serialize(ExcludePasswordGetAllDto)
  async getAllUnit(@Body() body: GetAllQueryDto) {
    return this.itemService.getAll(body);
  }

  @Roles('admin', 'wh')
  @Post('/create')
  async createItem(@Body() body: CreateItemDto, @GetUser() user: User) {
    return this.itemService.create(body, user);
  }

  @Get('/read/:id')
  async getItem(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.get(id);
  }

  @Roles('admin', 'wh', 'commerce')
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
  @Roles('admin', 'wh')
  @Post('/delete')
  async deleteItem(@Body() body: DeleteDataDto, @GetUser() user: User) {
    await this.itemService.delete(body.ids, user);
    return null;
  }
}
