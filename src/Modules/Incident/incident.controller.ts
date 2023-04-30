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
import { User } from '../User/user.entity';

import {
  ConfirmFirstTier,
  CreateIncidentDto,
  UpdateCommerceCode,
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

  @HttpCode(200)
  @Post('/get_warehouse_order')
  @Serialize(ExcludePasswordGetAllDto)
  async getWarehouseOrder(
    @Body() body: GetAllQueryDto & { show_all: boolean },
  ) {
    return this.incidentService.getWarehouseOrder(body);
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

  @Post('/update-commerce-code')
  updateCommerceCode(@Body() body: UpdateCommerceCode, @GetUser() user: User) {
    return this.incidentService.updateCommerceCode(body, user);
  }
}
