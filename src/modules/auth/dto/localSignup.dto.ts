import { ApiProperty } from '@nestjs/swagger';
import { BusinessType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
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
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({ enum: BusinessType })
  @IsString()
  @IsNotEmpty()
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  playerId: string;
}
