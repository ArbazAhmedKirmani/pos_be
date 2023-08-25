import { Module } from '@nestjs/common';
import { TableWaiterController } from './table-waiter.controller';
import { TableWaiterService } from './table-waiter.service';

@Module({
  controllers: [TableWaiterController],
  providers: [TableWaiterService]
})
export class TableWaiterModule {}
