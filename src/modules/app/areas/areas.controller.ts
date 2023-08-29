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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { Authorized, User } from 'src/utils/decorators';
import { UserRole } from '@prisma/client';
import { CreateAreaDto, UpdateAreaDto } from './dto';
import { ParamsDto, QueryParamDto } from 'src/utils/dto';

@ApiBearerAuth('access_token')
@ApiTags('Areas')
@Controller('areas')
export class AreasController {
  constructor(private areaService: AreasService) {}

  @ApiQuery({ type: QueryParamDto })
  @HttpCode(HttpStatus.OK)
  @Authorized([UserRole.ADMIN, UserRole.MANAGER, UserRole.SUB_ADMIN])
  @Get()
  async getAllAreas(
    @Query() query: QueryRequestParams,
    @User() user: AuthUser,
  ) {
    return await this.areaService.getAllAreas(query, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.OK)
  @Authorized([UserRole.ADMIN, UserRole.MANAGER, UserRole.SUB_ADMIN])
  @Get(':id')
  async getAreaById(@Param('id') id: string, @User() user: AuthUser) {
    return await this.areaService.getAreaById(Number(id), user);
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
