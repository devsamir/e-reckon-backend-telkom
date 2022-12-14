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

import { User } from '@prisma/client';
import { Roles } from 'src/Common/decorators/Roles';

import { GetUser } from '../../Common/decorators/GetUser';
import { DeleteDataDto } from '../../Common/dtos/deleteDataDto';
import {
  ExcludePasswordDto,
  ExcludePasswordGetAllDto,
} from '../../Common/dtos/excludePasswordDto';
import { GetAllQueryDto } from '../../Common/dtos/getAllDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';

import {
  ConfirmFirstTier,
  CreateIncidentDto,
  UpdateIncidentDto,
} from './incident.dto';
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
    return this.incidentService.getAll(body);
  }

  @Roles('admin', 'tl')
  @Post('/create')
  createIncident(@Body() body: CreateIncidentDto, @GetUser() user: User) {
    return this.incidentService.create(body, user);
  }

  @Get('/read/:id')
  async getIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentService.get(id);
  }

  @Roles('admin', 'tl', 'first_tier', 'mitra')
  @Patch('/write/:id')
  async updateIncident(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateIncidentDto,
    @GetUser() user: User,
  ) {
    return this.incidentService.update(id, body, user);
  }

  @Roles('admin', 'tl')
  @HttpCode(204)
  @Post('/delete')
  async deleteIncident(@Body() body: DeleteDataDto) {
    return this.incidentService.delete(body.ids);
  }

  @Post('/confirm-first-tier')
  confirmFirstTier(@Body() body: ConfirmFirstTier, @GetUser() user: User) {
    return this.incidentService.confirmFirstTier(body, user);
  }

  @Post('/finish-incident-mitra')
  finishIncidentMitra(@Body() body: ConfirmFirstTier, @GetUser() user: User) {
    return this.incidentService.finishIncidentMitra(body, user);
  }
  @Post('/return-to-mitra')
  returnWhSecondTier(@Body() body: ConfirmFirstTier, @GetUser() user: User) {
    return this.incidentService.returnToMitra(body, user);
  }
  @Post('/close-incident')
  closeIncident(@Body() body: ConfirmFirstTier, @GetUser() user: User) {
    return this.incidentService.closeIncident(body, user);
  }
}
