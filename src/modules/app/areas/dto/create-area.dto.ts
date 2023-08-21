import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAreaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  areaName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deliveryTime: string;

  @ApiProperty()
  @IsDecimal()
  @IsNotEmpty()
  deliveryCharges: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  allBranch: boolean;

  @ApiProperty()
  @IsArray()
  branchIds: Array<{ branchId: number }>;
}
