import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { catchErrorResponse } from 'src/utils/responses';
import { CreateAreaDto, UpdateAreaDto } from './dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async getAllAreas(query: QueryRequestParams, user: AuthUser) {
    try {
      return await this.prisma.areas.findMany({
        where: {
          isDeleted: false,
          companyId: user.company.companyId,
          ...(query?.search && { areaName: { contains: query.search } }),
        },
        skip: query.skip || ENV_CONSTANTS.QUERY.SKIP,
        take: query.take || ENV_CONSTANTS.QUERY.TAKE,
        orderBy: { createdAt: query.orderBy || 'desc' },
        select: {
          areaId: true,
          areaName: true,
          branch: { select: { branchId: true, branchName: true } },
        },
      });
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async getAreaById(id: number, user: AuthUser) {
    try {
      const area = await this.prisma.areas.findUnique({
        where: {
          areaId: id,
          companyId: user.company.companyId,
          isDeleted: false,
        },
        select: {
          areaId: true,
          areaName: true,
          startTime: true,
          endTime: true,
          deliveryCharges: true,
          deliveryTime: true,
          branch: { select: { branchId: true, branchName: true } },
        },
      });

      if (!area)
        throw new HttpException('Area not found', HttpStatus.NOT_FOUND);

      return area;
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async createArea(dto: CreateAreaDto, user: AuthUser) {
    try {
      const area = await this.prisma.areas.findFirst({
        where: { areaName: dto.areaName, isDeleted: false },
      });
      if (area)
        throw new HttpException(
          'Area already exists with provided area name',
          HttpStatus.CONFLICT,
        );

      await this.prisma.areas.create({
        data: {
          areaName: dto.areaName,
          deliveryCharges: dto.deliveryCharges,
          deliveryTime: dto.deliveryTime,
          startTime: dto.startTime,
          endTime: dto.endTime,
          companyId: user.company.companyId,
          createdBy: user.userId,
          branch: {
            connect: dto.allBranch
              ? await this.prisma.branch.findMany({
                  where: {
                    companyId: user.company.companyId,
                    isDeleted: false,
                  },
                })
              : dto.branchIds,
          },
        },
      });
      return 'Area created successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async updateArea(dto: UpdateAreaDto, user: AuthUser) {
    try {
      const area_id = dto.areaId;
      delete dto.areaId;
      const area = await this.prisma.areas.findUnique({
        where: {
          areaId: area_id,
          isDeleted: false,
          companyId: user.company.companyId,
        },
        select: { areaId: true },
      });

      if (!area)
        throw new HttpException('Areas not found', HttpStatus.NOT_FOUND);

      await this.prisma.areas.update({
        where: { areaId: area_id, companyId: user.company.companyId },
        data: dto,
      });

      return 'Area Updated Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async deleteArea(id, user: AuthUser) {
    try {
      const area = await this.prisma.areas.update({
        where: {
          areaId: id,
          companyId: user.company.companyId,
          isDeleted: false,
        },
        data: { isDeleted: true, updatedBy: user.userId },
        select: { areaId: true },
      });

      if (!area)
        throw new HttpException('Areas not found', HttpStatus.NOT_FOUND);

      return 'Area Deleted Successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }
}
