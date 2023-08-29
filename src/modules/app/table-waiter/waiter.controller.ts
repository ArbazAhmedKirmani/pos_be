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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TableWaiterService } from './table-waiter.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { Authorized, User } from 'src/utils/decorators';
import { CreateWaiterDto, UpdateWaiterDto } from './dto';
import { ParamsDto, QueryParamDto } from 'src/utils/dto';

@ApiBearerAuth('access_token')
@ApiTags('Waiters')
@Controller('waiter')
export class WaiterController {
  constructor(private tableWaiterService: TableWaiterService) {}

  @ApiQuery({ type: QueryParamDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getWaiter(@Query() query: QueryRequestParams, @User() user: AuthUser) {
    return await this.tableWaiterService.getWaiter(query, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getWaiterById(@Param('id') id: string, @User() user: AuthUser) {
    return await this.tableWaiterService.getWaiterById(Number(id), user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Authorized(false)
  @Post()
  async createWaiter(@Body() dto: CreateWaiterDto, @User() user: AuthUser) {
    return await this.tableWaiterService.createWaiter(dto, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.CREATED)
  @Authorized(false)
  @Patch(':id')
  async updateWaiter(
    @Param('id') id: string,
    @Body() dto: UpdateWaiterDto,
    @User() user: AuthUser,
  ) {
    return await this.tableWaiterService.updateWaiter(Number(id), dto, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.CREATED)
  @Delete(':id')
  async deleteWaiter(@Param('id') id: string, @User() user: AuthUser) {
    return await this.tableWaiterService.deleteWaiter(Number(id), user);
  }
}
