import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ExcludePasswordDto,
  ExcludePasswordGetAllDto,
} from '../../Common/dtos/excludePasswordDto';
import { GetAllQueryDto } from '../../Common/dtos/getAllDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';

import { DatelService } from './datel.service';

@Controller('datel')
@UseGuards(AdminGuard)
@Serialize(ExcludePasswordDto)
export class DatelController {
  constructor(private datelService: DatelService) {}

  @HttpCode(200)
  @Serialize(ExcludePasswordGetAllDto)
  @Post('/search_read')
  async getAllDatel(@Body() body: GetAllQueryDto) {
    const datels = await this.datelService.getAll(body);

    return datels;
  }

  @Get('/read/:id')
  async getDatel(@Param('id', ParseIntPipe) id: number) {
    const datel = await this.datelService.get(id);

    return datel;
  }
}
