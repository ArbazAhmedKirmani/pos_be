import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserBranchDto {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  branches: Array<{ branchId: number }>;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ name: 'fullname' })
  @IsOptional()
  @IsString()
  fullname: string;
}
