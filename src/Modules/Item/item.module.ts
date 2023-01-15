import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitModule } from '../Unit/unit.module';

import { ItemController } from './item.controller';
import { Item } from './item.entity';
import { ItemService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UnitModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
