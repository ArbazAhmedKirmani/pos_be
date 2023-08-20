import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { decryptText, generateRandomPassword } from 'src/helpers';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthUser, QueryRequestParams } from 'src/utils/interfaces';
import { catchErrorResponse } from 'src/utils/responses';
import { CreateUserDto } from './dto';
import { CompanySetttings, NotificationSettings } from '@prisma/client';

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

  async getUsetById(id: string | number, user: AuthUser) {
    try {
      const user_id: number = +id; //+decryptText(id);
      const user_by_id = await this.prisma.users.findUnique({
        where: {
          userId: user_id,
          companyId: user.company.companyId,
          isDeleted: false,
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
          isDeleted: false,
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

      const auto_generated_password = generateRandomPassword();

      await this.prisma.users.create({
        data: {
          companyId: user.company.companyId,
          fullname: dto.fullname,
          email: dto.email,
          role: dto.role,
          branch: { connect: [{ branchId: dto.branchId }] },
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
}
