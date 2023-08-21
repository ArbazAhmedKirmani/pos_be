import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from 'src/utils/guards';
import { Authorized, User } from 'src/utils/decorators';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { CreateUserDto, UpdateUserBranchDto, UpdateUserDto } from './dto';

@ApiBearerAuth('access-token')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Authorized([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.BRANCH_MANAGER,
  ])
  @Get()
  async getusers(@Query() query: QueryRequestParams, @User() user: AuthUser) {
    return this.userService.getAll(query, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Authorized([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.BRANCH_MANAGER,
  ])
  async getUserById(@Param('id') id: string, @User() user: AuthUser) {
    return await this.userService.getUsetById(id, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @Authorized([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.BRANCH_MANAGER,
  ])
  async getUserProfile(@User() user: AuthUser) {
    return await this.userService.getUsetById(user.userId, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Authorized([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN])
  async createUser(@Body() dto: CreateUserDto, @User() user: AuthUser) {
    return await this.userService.createUser(dto, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch()
  @Authorized([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN])
  async updateUser(@Body() dto: UpdateUserDto, @User() user: AuthUser) {
    return await this.userService.updateUser(dto, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('update-branch')
  @Authorized([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN])
  async updateUserBranches(
    @Body() dto: UpdateUserBranchDto,
    @User() user: AuthUser,
  ) {
    return await this.userService.updateUserBranches(dto, user);
  }
}
