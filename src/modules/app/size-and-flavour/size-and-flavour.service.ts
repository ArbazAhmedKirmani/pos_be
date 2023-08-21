import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, SizeQueryParamInterface } from 'src/utils/interfaces';
import { catchErrorResponse } from 'src/utils/responses';
import { CreateSizeDto } from './dto';

@Injectable()
export class SizeAndFlavourService {
  constructor(private prisma: PrismaService) {}

  async getAllSizes(query: SizeQueryParamInterface, user: AuthUser) {
    try {
      const sizes = this.prisma.size.findMany({
        where: {
          companyId: user.company.companyId,
          ...(query?.type && { type: query.type }),
        },
        take: query?.take || ENV_CONSTANTS.QUERY.TAKE,
        skip: query?.skip || ENV_CONSTANTS.QUERY.SKIP,
        orderBy: { sizeId: query?.orderBy || 'desc' },
        select: {
          sizeId: true,
          sizeName: true,
          type: true,
          buyingUnitConversion: true,
          sellingUnitConversion: true,
          distributionUnitConversion: true,
        },
      });

      if (!sizes)
        throw new HttpException('Size not found', HttpStatus.NOT_FOUND);

      return sizes;
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async getSizeById(id: number, user: AuthUser) {
    try {
      const size = await this.prisma.size.findUnique({
        where: { sizeId: id, companyId: user.company.companyId },
        select: {
          sizeId: true,
          sizeName: true,
          type: true,
          buyingUnitConversion: true,
          sellingUnitConversion: true,
          distributionUnitConversion: true,
        },
      });

      if (!size)
        throw new HttpException("Size doesn't exists", HttpStatus.NOT_FOUND);

      return size;
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async createSize(dto: CreateSizeDto, user: AuthUser) {
    try {
      const size_list = await this.prisma.size.findMany({
        where: { companyId: user.company.companyId, sizeName: dto.sizeName },
        select: { sizeId: true },
      });

      if (!size_list)
        throw new HttpException(
          'Size with the similar name already exists',
          HttpStatus.CONFLICT,
        );

      await this.prisma.size.create({
        data: {
          sizeName: dto.sizeName,
          type: dto.type,
          companyId: user.company.companyId,
        },
      });

      return 'Size Created Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }
}
