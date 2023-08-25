import { ApiProperty } from '@nestjs/swagger';
import { SizeType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateFlavourDto {
  @ApiProperty()
  @IsString()
  flavourName: string;
}
