import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { catchErrorResponse } from 'src/utils/responses';
import { CreateAreaDto, UpdateAreaDto } from './dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async getAllAreas(query: QueryRequestParams, user: AuthUser) {
    return await this.prisma.areas.findMany({
      where: {
        deletedAt: null,
        companyId: user.company.companyId,
        ...(query?.search && { areaName: { contains: query.search } }),
      },
      skip: query.skip || AppConfig.QUERY.SKIP,
      take: query.take || AppConfig.QUERY.TAKE,
      orderBy: { createdAt: query.orderBy || 'desc' },
      select: {
        areaId: true,
        areaName: true,
        branch: {
          where: { deletedAt: null },
          select: { branchId: true, branchName: true },
        },
      },
    });
  }

  async getAreaById(id: number, user: AuthUser) {
    const area = await this.prisma.areas.findUnique({
      where: {
        areaId: id,
        companyId: user.company.companyId,
        deletedAt: null,
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

    if (!area) throw new HttpException('Area not found', HttpStatus.NOT_FOUND);

    return area;
  }

  async createArea(dto: CreateAreaDto, user: AuthUser) {
    try {
      const area = await this.prisma.areas.findFirst({
        where: { areaName: dto.areaName, deletedAt: null },
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
                    deletedAt: null,
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
          deletedAt: null,
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
          deletedAt: null,
        },
        data: { deletedAt: new Date(), updatedBy: user.userId },
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
