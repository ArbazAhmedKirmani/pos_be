import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AuthUser,
  QueryRequestParams,
  SizeQueryParamInterface,
} from 'src/utils/interfaces';
import { catchErrorResponse } from 'src/utils/responses';
import {
  CreateFlavourDto,
  CreateSizeDto,
  UpdateFlavourDto,
  UpdateSizeDto,
} from './dto';

@Injectable()
export class SizeAndFlavourService {
  constructor(private prisma: PrismaService) {}

  // SIZES

  async getAllSizes(query: SizeQueryParamInterface, user: AuthUser) {
    try {
      const sizes = this.prisma.size.findMany({
        where: {
          companyId: user.company.companyId,
          ...(query?.type && { type: query.type }),
        },
        take: query?.take || ENV_CONSTANTS.QUERY.TAKE,
        skip: query?.skip || ENV_CONSTANTS.QUERY.SKIP,
        orderBy: { sizeId: query?.orderBy },
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

  async updateSize(id: number, dto: UpdateSizeDto, user: AuthUser) {
    try {
      const size = await this.prisma.size.findMany({
        where: {
          companyId: user.company.companyId,
          sizeId: id,
        },
        select: { sizeId: true },
      });

      if (!size)
        throw new HttpException("Size doesn't exists", HttpStatus.NOT_FOUND);

      await this.prisma.size.update({
        where: { companyId: user.company.companyId, sizeId: id },
        data: dto,
      });

      return 'Size Updated Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async deleteSize(id: number, user: AuthUser) {
    try {
      const size = await this.prisma.size.findMany({
        where: {
          companyId: user.company.companyId,
          sizeId: id,
        },
        select: { sizeId: true },
      });

      if (!size)
        throw new HttpException("Size doesn't exists", HttpStatus.NOT_FOUND);

      await this.prisma.size.delete({
        where: { companyId: user.company.companyId, sizeId: id },
      });

      return 'Size Deleted Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  // FLAVOURS

  async getAllFlavours(query: QueryRequestParams, user: AuthUser) {
    try {
      const sizes = this.prisma.flavour.findMany({
        where: {
          companyId: user.company.companyId,
        },
        take: query?.take || ENV_CONSTANTS.QUERY.TAKE,
        skip: query?.skip || ENV_CONSTANTS.QUERY.SKIP,
        orderBy: { flevourId: query?.orderBy || 'desc' },
        select: {
          flevourId: true,
          flavourName: true,
        },
      });

      if (!sizes)
        throw new HttpException('Flavour not found', HttpStatus.NOT_FOUND);

      return sizes;
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async getFlavourById(id: number, user: AuthUser) {
    try {
      const size = await this.prisma.flavour.findUnique({
        where: { flevourId: id, companyId: user.company.companyId },
        select: {
          flevourId: true,
          flavourName: true,
        },
      });

      if (!size)
        throw new HttpException("Flavour doesn't exists", HttpStatus.NOT_FOUND);

      return size;
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async createFlavour(dto: CreateFlavourDto, user: AuthUser) {
    try {
      const size_list = await this.prisma.flavour.findMany({
        where: {
          companyId: user.company.companyId,
          flavourName: dto.flavourName,
        },
        select: { flevourId: true },
      });

      if (!size_list)
        throw new HttpException(
          'Flavour with the similar name already exists',
          HttpStatus.CONFLICT,
        );

      await this.prisma.size.create({
        data: {
          sizeName: dto.flavourName,
          companyId: user.company.companyId,
        },
      });

      return 'Flavour Created Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async updateFlavour(id: number, dto: UpdateFlavourDto, user: AuthUser) {
    try {
      const size = await this.prisma.flavour.findMany({
        where: {
          companyId: user.company.companyId,
          flevourId: id,
        },
        select: { flevourId: true },
      });

      if (!size)
        throw new HttpException("Flavour doesn't exists", HttpStatus.NOT_FOUND);

      await this.prisma.flavour.update({
        where: { companyId: user.company.companyId, flevourId: id },
        data: dto,
      });

      return 'Flavour Updated Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async deleteFlavour(id: number, user: AuthUser) {
    try {
      const size = await this.prisma.flavour.findMany({
        where: {
          companyId: user.company.companyId,
          flevourId: id,
        },
        select: { flevourId: true },
      });

      if (!size)
        throw new HttpException("Flavour doesn't exists", HttpStatus.NOT_FOUND);

      await this.prisma.flavour.delete({
        where: { companyId: user.company.companyId, flevourId: id },
      });

      return 'Size Deleted Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }
}
