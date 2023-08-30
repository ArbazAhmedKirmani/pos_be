import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OrderbyType } from '../interfaces';

export class QueryParamDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderBy?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  take?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  skip?: number;
}
