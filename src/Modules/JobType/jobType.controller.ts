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

import { CreateUpdateJobTypeDto } from './jobType.dto';
import { JobTypeService } from './jobType.service';

@Controller('job-type')
@Serialize(ExcludePasswordDto)
@UseGuards(AdminGuard)
export class JobTypeController {
  constructor(private jobTypeService: JobTypeService) {}

  @HttpCode(200)
  @Post('/search_read')
  @Serialize(ExcludePasswordGetAllDto)
  async getAllUnit(@Body() body: GetAllQueryDto) {
    const jobTypes = await this.jobTypeService.getAll(body);
    return jobTypes;
  }

  @Roles('admin')
  @Post('/create')
  async createUnit(
    @Body() body: CreateUpdateJobTypeDto,
    @GetUser() user: User,
  ) {
    const jobType = await this.jobTypeService.create(body, user);
    return jobType;
  }

  @Get('/read/:id')
  async getUnit(@Param('id', ParseIntPipe) id: number) {
    const jobType = await this.jobTypeService.get(id);
    return jobType;
  }

  @Roles('admin')
  @Patch('/write/:id')
  async updateUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateJobTypeDto,
    @GetUser() user: User,
  ) {
    const jobType = await this.jobTypeService.update(id, body, user);
    return jobType;
  }

  @HttpCode(204)
  @Roles('admin')
  @Post('/delete')
  async deleteUser(@Body() body: DeleteDataDto, @GetUser() user: User) {
    await this.jobTypeService.delete(body.ids, user);
    return null;
  }
}
