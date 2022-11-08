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
import { GetAllQueryDto } from '../../Common/dtos/getAllDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';

import { CreateIncidentDto, UpdateIncidentDto } from './incident.dto';
import { IncidentService } from './incident.service';

@UseGuards(AdminGuard)
@Serialize(ExcludePasswordDto)
@Controller('incident')
export class IncidentController {
  constructor(private incidentService: IncidentService) {}

  @HttpCode(200)
  @Post('/search_read')
  @Serialize(ExcludePasswordGetAllDto)
  async getAllIncident(@Body() body: GetAllQueryDto) {
    console.log(body);
    return this.incidentService.getAll(body);
  }

  @Post('/create')
  createIncident(@Body() body: CreateIncidentDto, @GetUser() user: User) {
    return this.incidentService.create(body, user);
  }

  @Get('/read/:id')
  async getIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentService.get(id);
  }

  @Patch('/write/:id')
  async updateIncident(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateIncidentDto,
    @GetUser() user: User,
  ) {
    return this.incidentService.update(id, body, user);
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentService.delete(id);
  }
}
