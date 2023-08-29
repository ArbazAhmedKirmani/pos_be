import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { decryptText, generateRandomPassword } from 'src/helpers';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { catchErrorResponse } from 'src/utils/responses';
import { CreateUserDto, UpdateUserBranchDto, UpdateUserDto } from './dto';
import {
  CompanySetttings,
  NotificationSettings,
  UserRole,
} from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: QueryRequestParams, user: AuthUser) {
    try {
      return await this.prisma.users.findMany({
        where: { companyId: user.company.companyId },
        take: query.take,
        skip: query.skip,
        orderBy: { createdAt: query.orderBy || 'desc' },
        select: {
          userId: true,
          fullname: true,
          email: true,
          isEmailVerified: true,
          isActive: true,
          cityId: true,
          branch: { select: { branchId: true, branchName: true } },
        },
      });
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async getUsetById(id: number, user: AuthUser) {
    try {
      const user_id: number = id; //+decryptText(id);
      const user_by_id = await this.prisma.users.findUnique({
        where: {
          userId: user_id,
          companyId: user.company.companyId,
          deletedAt: null,
        },
      });
      delete user_by_id.password;
      return user_by_id;
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async createUser(dto: CreateUserDto, user: AuthUser) {
    try {
      const user_count: number = await this.prisma.users.count({
        where: {
          companyId: user.company.companyId,
          deletedAt: null,
        },
      });

      if (
        user_count >=
        +user.company.companySettings[CompanySetttings.NUMBER_OF_USERS]
      )
        throw new HttpException(
          'User Creation Limit Reached. You can contact system administrator to upgrade your account.',
          HttpStatus.CONFLICT,
        );

      const auto_generated_password = await generateRandomPassword();

      await this.prisma.users.create({
        data: {
          companyId: user.company.companyId,
          fullname: dto.fullname,
          email: dto.email,
          role: dto.role,
          branch: {
            connect:
              dto.allBranches &&
              dto.role !==
                (UserRole.CASHIER ||
                  UserRole.BRANCH_MANAGER ||
                  UserRole.CALL_CENTER)
                ? await this.prisma.branch.findMany({
                    where: {
                      companyId: user.company.companyId,
                      deletedAt: null,
                    },
                  })
                : dto.branchIds,
          },
          password: auto_generated_password,
          notification: true,
          createdBy: user.userId,
          notificationSettings: {
            create: [
              {
                setting: NotificationSettings.DIRECT_LINK,
                value: 'false',
              },
              {
                setting: NotificationSettings.IS_STICKY,
                value: 'false',
              },
            ],
          },
        },
      });

      return 'User has been successfully created';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async updateUser(dto: UpdateUserDto, user: AuthUser) {
    try {
      const user_id = dto.userId;
      delete dto.userId;

      const updated_user = await this.prisma.users.update({
        where: {
          companyId: user.company.companyId,
          userId: user_id,
          isApproved: true,
          deletedAt: null,
        },
        data: { ...dto, updatedBy: user.userId },
        select: { userId: true },
      });

      if (!updated_user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      return 'User updated successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }

  async updateUserBranches(dto: UpdateUserBranchDto, user: AuthUser) {
    try {
      const updated_user = await this.prisma.users.update({
        where: {
          companyId: user.company.companyId,
          userId: dto.userId,
          isApproved: true,
          deletedAt: null,
        },
        data: {
          branch: { set: [], connect: dto.branches },
        },
        select: { userId: true },
      });

      if (!updated_user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      return 'User updated successfully';
    } catch (error) {
      catchErrorResponse(error);
    }
  }
}
