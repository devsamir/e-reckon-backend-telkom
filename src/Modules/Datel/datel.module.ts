import { Module } from '@nestjs/common';

import { DatelController } from './datel.controller';
import { DatelService } from './datel.service';

@Module({
  imports: [],
  controllers: [DatelController],
  providers: [DatelService],
})
export class DatelModule {}
