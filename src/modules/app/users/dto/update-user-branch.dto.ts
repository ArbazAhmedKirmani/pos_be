import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserBranchDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  branches: Array<{ branchId: number }>;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
