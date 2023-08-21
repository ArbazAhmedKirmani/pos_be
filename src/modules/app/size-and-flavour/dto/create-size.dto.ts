import { ApiProperty } from '@nestjs/swagger';
import { SizeType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sizeName: string;

  @ApiProperty({ enum: SizeType })
  @IsEnum(SizeType)
  @IsNotEmpty()
  type: SizeType;
}
