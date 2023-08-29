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
import { Authorized, User } from 'src/utils/decorators';
import { ParamsDto, QueryParamDto } from 'src/utils/dto';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { TableWaiterService } from './table-waiter.service';
import { CreateTableDto, UpdateTableDto } from './dto';

@ApiBearerAuth('access_token')
@ApiTags('Tables')
@Controller('table')
export class TableController {
  constructor(private tableWaiterService: TableWaiterService) {}

  @ApiQuery({ type: QueryParamDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getTable(@Query() query: QueryRequestParams, @User() user: AuthUser) {
    return await this.tableWaiterService.getTables(query, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getTableById(@Param('id') id: string, @User() user: AuthUser) {
    return await this.tableWaiterService.getTableById(Number(id), user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Authorized(false)
  @Post()
  async createTable(@Body() dto: CreateTableDto, @User() user: AuthUser) {
    return await this.tableWaiterService.createTable(dto, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.CREATED)
  @Authorized(false)
  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() dto: UpdateTableDto,
    @User() user: AuthUser,
  ) {
    return await this.tableWaiterService.updateTable(Number(id), dto, user);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteTable(@Param('id') id: string, @User() user: AuthUser) {
    return await this.tableWaiterService.deleteTable(Number(id), user);
  }
}
