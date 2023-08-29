import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAreaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  areaName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  endTime?: string;

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
  @IsOptional()
  branchIds: Array<{ branchId: number }>;
}
