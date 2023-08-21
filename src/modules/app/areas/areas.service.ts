import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { CreateAreaDto } from './dto/create-area.dto';

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
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
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
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
