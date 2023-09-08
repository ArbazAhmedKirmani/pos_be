import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthUser } from 'src/utils/interfaces';
import { Authorized, User } from 'src/utils/decorators';
import { ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { ParamsDto, QueryParamDto } from 'src/utils/dto';
import { UserRole } from '@prisma/client';
import { CreateCustomerDto } from './dto';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @ApiProperty()
  @ApiQuery({ type: QueryParamDto })
  @Authorized([
    UserRole.CASHIER,
    UserRole.CALL_CENTER,
    UserRole.BRANCH_MANAGER,
    UserRole.MANAGER,
  ])
  @Get('phone-or-number')
  async getCustomerByPhoneOrName(
    phoneOrName: string,
    @User() user: AuthUser,
    @Query() query: QueryParamDto,
  ) {
    const customers = await this.customerService.getCustomerByPhoneOrName(
      phoneOrName,
      user,
      query,
    );
    return customers;
  }

  @ApiProperty()
  @ApiParam({ name: 'id', type: ParamsDto })
  @Authorized([
    UserRole.CASHIER,
    UserRole.CALL_CENTER,
    UserRole.BRANCH_MANAGER,
    UserRole.MANAGER,
  ])
  @Get(':id')
  async getCustomerById(@User() user: AuthUser, @Param('id') id: string) {
    const customer = await this.customerService.getCustomerById(
      Number(id),
      user,
    );
    return customer;
  }

  @Post()
  async createCustomer(@Body() dto: CreateCustomerDto, @User() user: AuthUser) {
    const customer = await this.customerService.createCustomer(dto, user);
  }
}
