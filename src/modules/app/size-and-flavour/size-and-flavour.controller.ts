import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SizeAndFlavourService } from './size-and-flavour.service';
import { AuthUser, SizeQueryParamInterface } from 'src/utils/interfaces';
import { User } from 'src/utils/decorators';

@ApiBearerAuth('access_token')
@ApiTags('Size And Flavour')
@Controller('size-and-flavour')
export class SizeAndFlavourController {
  constructor(private sizeAndFlavour: SizeAndFlavourService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllSizes(@Query() query: SizeQueryParamInterface, @User() user: AuthUser) {
    return this.sizeAndFlavour.getAllSizes(query, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getSizeById(@Param('id') id: number, @User() user: AuthUser) {
    return await this.sizeAndFlavour.getSizeById(id, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSize(@Body() dto, @User() user: AuthUser) {
    return await this.sizeAndFlavour.createSize(dto, user);
  }
}
