import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateTableDto {
  @ApiProperty()
  @IsString()
  tableName?: string;

  @ApiProperty()
  @IsNumber()
  branchId?: number;
}
