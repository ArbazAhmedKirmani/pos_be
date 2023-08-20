import { ApiProperty } from '@nestjs/swagger';
import { BusinessType } from '@prisma/client';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LocalSignupDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  website: string;

  @ApiProperty({ enum: BusinessType })
  @IsString()
  @IsNotEmpty()
  @IsEnum(BusinessType)
  businessType: BusinessType;
}
