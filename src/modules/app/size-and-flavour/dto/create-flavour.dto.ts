import { ApiProperty } from '@nestjs/swagger';
import { SizeType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateFlavourDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  flavourName: string;
}
