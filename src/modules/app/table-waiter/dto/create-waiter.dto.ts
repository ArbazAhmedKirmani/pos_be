import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateWaiterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  waiterName: string;

  @ApiProperty()
  @IsString()
  cnic: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  branchId: number;
}
