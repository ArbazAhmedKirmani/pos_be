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
import { AreasService } from './areas.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { Authorized, User } from 'src/utils/decorators';
import { UserRole } from '@prisma/client';
import { CreateAreaDto, UpdateAreaDto } from './dto';

@ApiBearerAuth('access_token')
@ApiTags('Areas')
@Controller('areas')
export class AreasController {
  constructor(private areaService: AreasService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllAreas(
    @Query() query: QueryRequestParams,
    @User() user: AuthUser,
  ) {
    return await this.areaService.getAllAreas(query, user);
  }

  @HttpCode(HttpStatus.OK)
  @Authorized([UserRole.ADMIN, UserRole.MANAGER, UserRole.SUB_ADMIN])
  @Get(':id')
  async getAreaById(@Param('id') id: number, @User() user: AuthUser) {
    return await this.areaService.getAreaById(id, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.MANAGER])
  @Post()
  async createArea(@Body() dto: CreateAreaDto, @User() user: AuthUser) {
    return await this.areaService.createArea(dto, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.MANAGER])
  @Patch()
  async updateArea(@Body() dto: UpdateAreaDto, @User() user: AuthUser) {
    return await this.areaService.updateArea(dto, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.MANAGER])
  @Delete(':id')
  async deleteArea(@Param('id') id: number, @User() user: AuthUser) {
    return this.areaService.deleteArea(id, user);
  }
}
