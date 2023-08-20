import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { AssignUser, CreateBranchDto } from './dto';
import { UserRole } from '@prisma/client';
import { ENV_CONSTANTS } from 'src/constants/env.constant';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async getAllBranches(user: AuthUser, params?: QueryRequestParams) {
    try {
      const branches = await this.prisma.branch.findMany({
        where: {
          isDeleted: false,
          companyId: user.company.companyId,
          ...((user.role === UserRole.MANAGER ||
            user.role === UserRole.BRANCH_MANAGER) && {
            branchId: { in: user.branch.map((branch) => branch.branchId) },
          }),
          ...(params?.search?.length > 0 && {
            branchName: { contains: params.search || undefined },
          }),
        },
        skip: params?.skip || ENV_CONSTANTS.QUERY.SKIP,
        take: params?.take || ENV_CONSTANTS.QUERY.TAKE,
        orderBy: [{ createdAt: params?.orderBy || 'desc' }],
        select: {
          branchId: true,
          branchName: true,
          description: true,
          longitude: true,
          latitude: true,
          address: true,
          type: true,
          startTime: true,
          endTime: true,
          isActive: true,
          user: {
            select: {
              userId: true,
              fullname: true,
              email: true,
            },
          },
          areas: { select: { areaId: true, areaName: true } },
          products: {
            select: {
              productId: true,
              productName: true,
              size: { select: { sizeName: true } },
              flavour: { select: { flavourName: true } },
            },
          },
        },
      });
      return branches;
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async getBranchById(user: AuthUser, id: string) {
    try {
      const branch = await this.prisma.branch.findUnique({
        where: { branchId: +id, user: { some: { userId: user.userId } } },
      });

      if (!branch)
        throw new HttpException('branch not found', HttpStatus.NOT_FOUND);

      return branch;
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async createBranch(dto: CreateBranchDto, user: AuthUser) {
    try {
      const branch = await this.prisma.branch.findFirst({
        where: { branchName: dto.branchName, isDeleted: false },
      });
      if (branch)
        throw new HttpException(
          'Branch already exists with provided branch name',
          HttpStatus.CONFLICT,
        );

      await this.prisma.branch.create({
        data: {
          branchName: dto.branchName,
          type: dto.type,
          description: dto?.description,
          longitude: dto?.longitude,
          latitude: dto?.latitude,
          startTime: dto?.startTime,
          endTime: dto.endTime,
          companyId: user.company.companyId,
          createdBy: user.userId,
        },
      });
      return await this.getAllBranches(user);
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async updateBranch(dto, user: AuthUser) {
    try {
      await this.prisma.branch.update({
        where: { branchId: dto.branchId },
        data: {
          branchName: dto?.branchName,
          longitude: dto?.longitude,
          latitude: dto?.latitude,
          description: dto?.description,
          address: dto?.address,
          startTime: dto?.startTime,
          endTime: dto?.endTime,
        },
      });

      return 'Branch updated successfully';
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async assignUserToBranch(dto: AssignUser, user: AuthUser) {
    try {
      const branch = await this.prisma.branch.update({
        where: {
          branchId: dto.branchId,
          companyId: user.company.companyId,
          isDeleted: false,
        },
        data: {
          user: {
            connect: dto.userIds.map((user) => ({ userId: user.userId })),
          },
        },
        select: { branchName: true },
      });

      return `Users successfully assigned to ${branch.branchName} Branch`;
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }
}