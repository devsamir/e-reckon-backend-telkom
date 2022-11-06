import { Module } from '@nestjs/common';

import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';

@Module({
  imports: [],
  controllers: [IncidentController],
  providers: [IncidentService],
})
export class IncidentModule {}
