import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateTableDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  branchId: number;
}
