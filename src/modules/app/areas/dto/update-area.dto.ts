import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAreaDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  areaId: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  areaName: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  startTime: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  endTime: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  deliveryTime: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  deliveryCharges: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  isActive: boolean;
}
