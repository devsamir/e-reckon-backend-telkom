import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobTypeController } from './jobType.controller';
import { JobType } from './jobType.entity';
import { JobTypeService } from './jobType.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobType])],
  controllers: [JobTypeController],
  providers: [JobTypeService],
  exports: [JobTypeService],
})
export class JobTypeModule {}
