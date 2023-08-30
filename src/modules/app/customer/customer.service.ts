import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryParamDto } from 'src/utils/dto';
import { AuthUser } from 'src/utils/interfaces';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getCustomerByPhoneOrName(
    phoneOrName: string,
    user: AuthUser,
    query: QueryParamDto,
  ) {
    const customers = await this.prisma.customer.findMany({
      where: {
        companyId: user.company.companyId,
        deletedAt: null,
        phone: { contains: phoneOrName, mode: 'insensitive' },
        customerName: { contains: phoneOrName, mode: 'insensitive' },
      },
      take: query?.take || AppConfig.QUERY.TAKE,
      skip: query?.skip || AppConfig.QUERY.SKIP,
      orderBy: { createdAt: query?.orderBy || AppConfig.QUERY.ORDER_BY }, // ,
      select: {
        customerId: true,
        customerAddress: true,
        customerName: true,
        phone: true,
      },
    });
    return customers;
  }

  async getCustomerById(id: number, user: AuthUser) {
    const customer = await this.prisma.customer.findMany({
      where: {
        companyId: user.company.companyId,
        deletedAt: null,
        customerId: id,
      },
      select: {
        customerId: true,
        customerAddress: true,
        customerName: true,
        phone: true,
      },
    });

    if (!customer)
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    return customer;
  }
}
