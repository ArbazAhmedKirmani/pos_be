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
import { BranchService } from './branch.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Authorized, User } from 'src/utils/decorators';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { AssignUser, CreateBranchDto } from './dto';
import { UserRole } from '@prisma/client';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ParamsDto, QueryParamDto } from 'src/utils/dto';

@ApiBearerAuth('access-token')
@ApiTags('Branch')
@Controller('branch')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @ApiQuery({ type: QueryParamDto })
  @Authorized([
    UserRole.ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.MANAGER,
    UserRole.SUB_ADMIN,
  ])
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllBranches(
    @Query() params: QueryRequestParams,
    @User() user: AuthUser,
  ) {
    return await this.branchService.getAllBranches(user, params);
  }

  @ApiParam({ name: 'id', type: ParamsDto })
  @Authorized([
    UserRole.ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.MANAGER,
    UserRole.SUB_ADMIN,
  ])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getBranchById(@User() user: AuthUser, @Param('id') id: string) {
    return await this.branchService.getBranchById(user, Number(id));
  }

  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBranch(@Body() dto: CreateBranchDto, @User() user: AuthUser) {
    return await this.branchService.createBranch(dto, user);
  }

  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @Delete(':id')
  async deleteBranch(@Param('id') id: number, @User() user: AuthUser) {
    return await this.branchService.deleteBranch(id, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch(':id')
  async updateBranch(
    @Param('id') param: number,
    @Body() dto: UpdateBranchDto,
    @User() user: AuthUser,
  ) {
    return this.branchService.updateBranch(param, dto, user);
  }

  @Authorized([UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @Post('assign-user')
  async assignUserToBranch(@Body() dto: AssignUser, @User() user: AuthUser) {
    return await this.branchService.assignUserToBranch(dto, user);
  }
}
