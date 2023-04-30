import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/Common/decorators/GetUser';

import {
  ExcludePasswordDto,
  ExcludePasswordGetAllDto,
} from '../../Common/dtos/excludePasswordDto';
import { AdminGuard } from '../../Guards/admin.guard';
import { Serialize } from '../../Interceptors/serialize.interceptor';
import { User } from '../User/user.entity';

import { GetDashboardData } from './report.entity';
import { ReportService } from './report.service';

@UseGuards(AdminGuard)
@Serialize(ExcludePasswordDto)
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @HttpCode(200)
  @Post('/dashboard')
  @Serialize(ExcludePasswordGetAllDto)
  async getDashboardData(
    @Body() body: GetDashboardData,
    @GetUser() user: User,
  ) {
    return this.reportService.getDashboardData(body, user);
  }
}
