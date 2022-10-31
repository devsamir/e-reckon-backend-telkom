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
  CreateUpdateUnitDto,
  ExcludeGetAllUnitDto,
  ExcludeUnitDto,
} from './unit.dto';
import { UnitService } from './unit.service';

@Controller('unit')
@Serialize(ExcludeUnitDto)
@UseGuards(AdminGuard)
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get()
  @Serialize(ExcludeGetAllUnitDto)
  async getAllUnit(@Body() body: GetAllQuery) {
    const units = await this.unitService.getAll(body);
    return units;
  }

  @Post()
  async createUnit(@Body() body: CreateUpdateUnitDto, @GetUser() user: User) {
    const unit = await this.unitService.create(body, user);
    return unit;
  }

  @Get('/:id')
  async getUnit(@Param('id', ParseIntPipe) id: number) {
    const unit = await this.unitService.get(id);
    return unit;
  }

  @Patch('/:id')
  async updateUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateUnitDto,
    @GetUser() user: User,
  ) {
    const unit = await this.unitService.update(id, body, user);
    return unit;
  }

  @HttpCode(204)
  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    await this.unitService.delete(id, user);
    return null;
  }
}
