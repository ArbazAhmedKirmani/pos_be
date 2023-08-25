import { ApiProperty } from '@nestjs/swagger';
import { SizeType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateSizeDto {
  @ApiProperty()
  @IsString()
  sizeName: string;

  @ApiProperty({ enum: SizeType })
  @IsEnum(SizeType)
  type: SizeType;
}
