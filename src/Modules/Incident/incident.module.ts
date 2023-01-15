import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatelModule } from '../Datel/datel.module';
import { ItemModule } from '../Item/item.module';
import { JobTypeModule } from '../JobType/jobType.module';
import { UserModule } from '../User/user.module';

import { IncidentController } from './incident.controller';
import { Incident } from './incident.entity';
import { IncidentService } from './incident.service';
import { IncidentDetail } from './incidentDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, IncidentDetail]),
    DatelModule,
    JobTypeModule,
    UserModule,
    ItemModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
})
export class IncidentModule {}
