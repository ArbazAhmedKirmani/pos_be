import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNumber } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsJWT()
  refresh_token: string;

  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
