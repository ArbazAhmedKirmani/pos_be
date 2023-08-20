import { ApiProperty } from '@nestjs/swagger';
import { BranchType } from '@prisma/client';
import { IsEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @ApiProperty()
  @IsEnum(BranchType)
  @IsNotEmpty()
  type: BranchType;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  longitude?: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  latitude?: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  startTime?: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  endTime?: string;
}
