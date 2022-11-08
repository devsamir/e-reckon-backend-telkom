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
import {
  ExcludePasswordDto,
  ExcludePasswordGetAllDto,
} from '../../Common/dtos/excludePasswordDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';

import { CreateUpdateUnitDto } from './unit.dto';
import { UnitService } from './unit.service';

@Controller('unit')
@Serialize(ExcludePasswordDto)
@UseGuards(AdminGuard)
export class UnitController {
  constructor(private unitService: UnitService) {}

  @HttpCode(200)
  @Post('/search_read')
  @Serialize(ExcludePasswordGetAllDto)
  async getAllUnit(@Body() body: GetAllQuery) {
    const units = await this.unitService.getAll(body);
    return units;
  }

  @Post('/create')
  async createUnit(@Body() body: CreateUpdateUnitDto, @GetUser() user: User) {
    const unit = await this.unitService.create(body, user);
    return unit;
  }

  @Get('/read/:id')
  async getUnit(@Param('id', ParseIntPipe) id: number) {
    const unit = await this.unitService.get(id);
    return unit;
  }

  @Patch('/write/:id')
  async updateUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateUnitDto,
    @GetUser() user: User,
  ) {
    const unit = await this.unitService.update(id, body, user);
    return unit;
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    await this.unitService.delete(id, user);
    return null;
  }
}
