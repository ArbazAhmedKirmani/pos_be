import { Module } from '@nestjs/common';
import { SizeAndFlavourController } from './size-and-flavour.controller';
import { SizeAndFlavourService } from './size-and-flavour.service';

@Module({
  controllers: [SizeAndFlavourController],
  providers: [SizeAndFlavourService]
})
export class SizeAndFlavourModule {}
