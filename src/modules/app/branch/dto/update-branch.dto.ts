import { ApiProperty } from '@nestjs/swagger';
import { BranchType } from '@prisma/client';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class UpdateBranchDto {
  @ApiProperty()
  @IsString()
  branchName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(BranchType)
  type: BranchType;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  longitude: string;

  @ApiProperty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
