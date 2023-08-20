import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AreasService } from './areas.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { Authorized, User } from 'src/utils/decorators';
import { UserRole } from '@prisma/client';

@ApiBearerAuth('access_token')
@ApiTags('Areas')
@Controller('areas')
export class AreasController {
  constructor(private areaService: AreasService) {}

  @Get()
  async getAllAreas(
    @Query() query: QueryRequestParams,
    @User() user: AuthUser,
  ) {
    return await this.areaService.getAllAreas(query, user);
  }

  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.MANAGER])
  @Post()
  async createArea(@Body() dto, @User() user: AuthUser) {
    return await this.areaService.createArea(dto, user);
  }
}
