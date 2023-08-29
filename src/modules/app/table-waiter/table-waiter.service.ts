import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import {
  CreateTableDto,
  CreateWaiterDto,
  UpdateTableDto,
  UpdateWaiterDto,
} from './dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TableWaiterService {
  constructor(private prisma: PrismaService, private i18n: I18nService) {}

  async getWaiter(query: QueryRequestParams, user: AuthUser) {
    return await this.prisma.waiters.findMany({
      where: {
        companyId: user.company.companyId,
        ...(query?.search &&
          query.search !== '' && {
            OR: [
              { waiterName: { contains: query.search, mode: 'insensitive' } },
              { cnic: { contains: query.search, mode: 'insensitive' } },
              { phone: { contains: query.search, mode: 'insensitive' } },
            ],
          }),
      },
      take: query.take,
      skip: query.skip,
      orderBy: {
        createdAt: query.orderBy,
      },
      select: {
        waiterId: true,
        waiterName: true,
        branch: { select: { branchId: true, branchName: true } },
        isActive: true,
        cnic: true,
        phone: true,
      },
    });
  }

  async getWaiterById(id: number, user: AuthUser) {
    return await this.prisma.waiters.findFirstOrThrow({
      where: { waiterId: id, companyId: user.company.companyId },
      select: {
        waiterId: true,
        waiterName: true,
        branch: { select: { branchId: true, branchName: true } },
        isActive: true,
        cnic: true,
        phone: true,
      },
    });
  }

  async createWaiter(dto: CreateWaiterDto, user: AuthUser) {
    await this.prisma.waiters.create({
      data: { ...dto, companyId: user.company.companyId },
    });

    return this.i18n.t('success.created');
  }

  async updateWaiter(id: number, dto: UpdateWaiterDto, user: AuthUser) {
    const waiter = await this.prisma.waiters.update({
      where: { companyId: user.company.companyId, waiterId: id },
      data: dto,
    });

    if (!waiter)
      throw new HttpException(
        this.i18n.t('error.not_found'),
        HttpStatus.NOT_FOUND,
      );

    return this.i18n.t('success.updated');
  }

  async deleteWaiter(id: number, user: AuthUser) {
    const waiter = await this.prisma.waiters.delete({
      where: { waiterId: id, companyId: user.company.companyId },
    });

    if (!waiter) {
      throw new HttpException(
        this.i18n.t('error.not_found'),
        HttpStatus.NOT_FOUND,
      );
    }
    return this.i18n.t('success.deleted');
  }

  async getTables(query: QueryRequestParams, user: AuthUser) {
    return await this.prisma.tables.findMany({
      where: {
        companyId: user.company.companyId,
        deletedAt: null,
        ...(query?.search &&
          query?.search !== '' && {
            OR: [
              { tableName: { contains: query.search, mode: 'insensitive' } },
            ],
          }),
      },
      take: query.take,
      skip: query.skip,
      orderBy: {
        createdAt: query.orderBy,
      },
      select: {
        tableId: true,
        tableName: true,
        branch: { select: { branchId: true, branchName: true } },
        isActive: true,
      },
    });
  }

  async getTableById(id: number, user: AuthUser) {
    const table = await this.prisma.tables.findFirstOrThrow({
      where: { tableId: id, companyId: user.company.companyId },
      select: {
        tableId: true,
        tableName: true,
        branch: { select: { branchId: true, branchName: true } },
        isActive: true,
        waiter: { select: { waiterId: true, waiterName: true } },
      },
    });

    if (!table)
      throw new HttpException(
        this.i18n.translate('error.not_found'),
        HttpStatus.NOT_FOUND,
      );

    return table;
  }

  async createTable(dto: CreateTableDto, user: AuthUser) {
    await this.prisma.tables.create({
      data: { ...dto, companyId: user.company.companyId },
    });

    return this.i18n.t('success.created');
  }

  async updateTable(id: number, dto: UpdateTableDto, user: AuthUser) {
    const table = await this.prisma.tables.update({
      where: { companyId: user.company.companyId, tableId: id },
      data: dto,
    });

    if (!table)
      throw new HttpException(
        this.i18n.t('error.not_found'),
        HttpStatus.NOT_FOUND,
      );

    return this.i18n.t('success.updated');
  }

  async deleteTable(id: number, user: AuthUser) {
    const waiter = await this.prisma.tables.delete({
      where: { tableId: id, companyId: user.company.companyId },
    });

    if (!waiter) {
      throw new HttpException(
        this.i18n.t('error.not_found'),
        HttpStatus.NOT_FOUND,
      );
    }
    return this.i18n.t('success.deleted');
  }
}
