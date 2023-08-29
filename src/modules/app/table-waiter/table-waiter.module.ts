import { Module } from '@nestjs/common';
import { WaiterController } from './waiter.controller';
import { TableWaiterService } from './table-waiter.service';
import { TableController } from './table.controller';

@Module({
  controllers: [WaiterController, TableController],
  providers: [TableWaiterService],
})
export class TableWaiterModule {}
