import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateWaiterDto {
  @ApiProperty()
  @IsString()
  waiterName?: string;

  @ApiProperty()
  @IsString()
  cnic?: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsNumber()
  branchId?: number;
}
