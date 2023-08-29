import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
