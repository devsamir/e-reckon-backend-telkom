import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatelController } from './datel.controller';
import { Datel } from './datel.entity';
import { DatelService } from './datel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Datel])],
  controllers: [DatelController],
  providers: [DatelService],
})
export class DatelModule {}
