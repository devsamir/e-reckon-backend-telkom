import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatelModule } from '../Datel/datel.module';
import { Incident } from '../Incident/incident.entity';
import { IncidentModule } from '../Incident/incident.module';
import { IncidentDetail } from '../Incident/incidentDetail.entity';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [IncidentModule, DatelModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
