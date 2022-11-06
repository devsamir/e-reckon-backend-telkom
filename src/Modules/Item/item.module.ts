import { Module } from '@nestjs/common';

import { UnitModule } from '../Unit/unit.module';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [UnitModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
