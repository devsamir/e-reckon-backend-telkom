import { Module } from '@nestjs/common';
import { MitraController } from './mitra.controller';
import { MitraService } from './mitra.service';

@Module({
  imports: [],
  controllers: [MitraController],
  providers: [MitraService],
})
export class MitraModule {}
