import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SizeAndFlavourService } from './size-and-flavour.service';
import {
  AuthUser,
  QueryRequestParams,
  SizeQueryParamInterface,
} from 'src/utils/interfaces';
import { User } from 'src/utils/decorators';
import {
  CreateFlavourDto,
  CreateSizeDto,
  UpdateFlavourDto,
  UpdateSizeDto,
} from './dto';

@ApiBearerAuth('access_token')
@ApiTags('Size And Flavour')
@Controller('size-and-flavour')
export class SizeAndFlavourController {
  constructor(private sizeAndFlavour: SizeAndFlavourService) {}

  @HttpCode(HttpStatus.OK)
  @Get('size')
  getAllSizes(@Query() query: SizeQueryParamInterface, @User() user: AuthUser) {
    return this.sizeAndFlavour.getAllSizes(query, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('size/:id')
  async getSizeById(@Param('id') id: number, @User() user: AuthUser) {
    return await this.sizeAndFlavour.getSizeById(id, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('size')
  async createSize(@Body() dto: CreateSizeDto, @User() user: AuthUser) {
    return await this.sizeAndFlavour.createSize(dto, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch('size/:id')
  async updateSize(
    @Param('id') id: number,
    @Body() dto: UpdateSizeDto,
    @User() user: AuthUser,
  ) {
    return await this.sizeAndFlavour.updateSize(id, dto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('size/:id')
  async deleteSize(@Param('id') id: number, @User() user: AuthUser) {
    return await this.sizeAndFlavour.deleteSize(id, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('flavour')
  getAllFlavours(@Query() query: QueryRequestParams, @User() user: AuthUser) {
    return this.sizeAndFlavour.getAllFlavours(query, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('flavour/:id')
  async getFlavourById(@Param('id') id: number, @User() user: AuthUser) {
    return await this.sizeAndFlavour.getFlavourById(id, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('flavour')
  async createFlavour(@Body() dto: CreateFlavourDto, @User() user: AuthUser) {
    return await this.sizeAndFlavour.createFlavour(dto, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch('flavour/:id')
  async updateFlavour(
    @Param('id') id: number,
    @Body() dto: UpdateFlavourDto,
    @User() user: AuthUser,
  ) {
    return await this.sizeAndFlavour.updateFlavour(id, dto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('flavour/:id')
  async deleteFlavour(@Param('id') id: number, @User() user: AuthUser) {
    return await this.sizeAndFlavour.deleteFlavour(id, user);
  }
}
