import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
