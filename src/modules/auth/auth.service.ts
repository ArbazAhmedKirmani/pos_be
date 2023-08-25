import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LocalLoginDto } from './dto/locallogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  compareHashString,
  hashString,
} from 'src/helpers/hashAndEncrypt.helper';
import { LoginResponse } from './interface/loginResponse.interface';
import { JwtService } from '@nestjs/jwt';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { AuthUser } from 'src/utils/interfaces';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LocalSignupDto,
  RefreshDto,
  ResetPasswordDto,
} from './dto';
import {
  BranchType,
  CompanySetttings,
  OrderMode,
  OrderStatus,
  UserRole,
} from '@prisma/client';
import { QueueService } from '../queue/queue.service';
import { Default_Company_Settings } from 'src/data/helper.data';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private queueService: QueueService,
  ) {}

  async loginLocal(dto: LocalLoginDto): Promise<LoginResponse> {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          email: dto.email,
          isActive: true,
          deletedAt: null,
        },
        select: {
          userId: true,
          email: true,
          password: true,
          fullname: true,
          role: true,
          branch: {
            select: {
              branchId: true,
              branchName: true,
              type: true,
            },
          },
          isEmailVerified: true,
          isApproved: true,
          company: {
            select: {
              companyId: true,
              businessType: true,
              companySettings: { select: { setting: true, value: true } },
            },
          },
          notificationSettings: {
            select: { setting: true, value: true },
          },
        },
      });

      if (!user)
        throw new HttpException(
          "User you're trying to authenticate doesn't exists",
          HttpStatus.NOT_FOUND,
        );

      if (!user.isEmailVerified)
        throw new HttpException(
          'Your Email is not verified. Please verify your email and try again',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      if (!user.isApproved)
        throw new HttpException(
          'Unfortunately! Your Account is not already approved by the company. Please be patient as we are verifying your account',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      const login_user_count: number = await this.prisma.loginLogs.count({
        where: { companyId: user.company.companyId },
      });

      if (dto?.playerId)
        await this.prisma.devices.create({
          data: {
            device: dto.playerId,
            userId: user.userId,
          },
        });

      if (
        +user.company.companySettings[
          CompanySetttings.NUMBER_OF_ACTIVE_USERS
        ] >= login_user_count
      )
        throw new HttpException(
          'Logged In User Limit has been reached. Please try again. Or contact service administrator to upgrade your account',
          HttpStatus.CONFLICT,
        );

      const isMatched = await compareHashString(dto.password, user.password);

      if (!isMatched)
        throw new HttpException(
          'Password is not correct',
          HttpStatus.FORBIDDEN,
        );

      delete user.password;

      const { access_token, refresh_token } = this.generateToken(user);

      const notifications = {
        new_notification: await this.prisma.notifications.count({
          where: {
            companyId: user.company.companyId,
            userId: user.userId,
            isRead: false,
          },
        }),
        new_order: await this.prisma.order.count({
          where: {
            status: OrderStatus.PENDING,
            companyId: user.company.companyId,
            branchId: { in: user.branch.map((b) => b.branchId) },
          },
        }),
      };

      this.prisma.loginLogs.create({
        data: {
          userId: user.userId,
          accessToken: access_token,
          refreshToken: refresh_token,
          companyId: user.company.companyId,
          expireAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      });

      const result: LoginResponse = {
        ...user,
        access_token,
        refresh_token,
        notifications,
      };
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async signupLocal(dto: LocalSignupDto) {
    try {
      const company = await this.prisma.company.create({
        data: {
          companyName: dto.companyName,
          address: dto.address,
          email: dto.email,
          website: dto.website,
          phone: dto.phone,
          businessType: dto.businessType,
          branch: {
            create: {
              branchName: 'Warehouse',
              type: BranchType.WAREHOUSE,
            },
          },
        },
        select: {
          companyId: true,
          businessType: true,
          branch: { select: { branchId: true, branchName: true, type: true } },
        },
      });

      await this.prisma.companySettings.createMany({
        data: Default_Company_Settings.map((option) => ({
          setting: option.setting,
          value: option.value,
          companyId: company.companyId,
        })),
      });

      const hashPassword = await hashString(ENV_CONSTANTS.DEFAULT_PASSWORD);

      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          password: hashPassword,
          fullname: dto.fullname,
          role: UserRole.ADMIN,
          companyId: company.companyId,
          isApproved: false,
        },
        select: {
          userId: true,
          email: true,
          fullname: true,
          company: { select: { companyName: true } },
        },
      });

      if (dto?.playerId)
        await this.prisma.devices.create({
          data: {
            device: dto.playerId,
            userId: user.userId,
          },
        });

      this.queueService.signupEmail({
        email: dto.email,
        fullname: user.fullname,
        companyName: user.company.companyName,
      });
      return "Your account with your company has been signed up successfully. We've sent you an email about further procedure.";
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async changePassword(dto: ChangePasswordDto, user: AuthUser) {
    try {
      if (dto.newPassword !== dto.renewPassword)
        throw new HttpException(
          "Password doesn't matches",
          HttpStatus.BAD_REQUEST,
        );

      const old_user = await this.prisma.users.findUnique({
        where: { userId: user.userId },
        select: { password: true },
      });

      const isMatched = await compareHashString(
        dto.oldPassword,
        old_user.password,
      );

      if (!isMatched)
        throw new HttpException(
          'Old password mismatch',
          HttpStatus.BAD_REQUEST,
        );

      const hash_password = await hashString(dto.newPassword);
      await this.prisma.users.update({
        where: { userId: user.userId },
        data: { password: hash_password },
      });

      return 'Password successfully changed';
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { email: dto.email },
        select: { userId: true },
      });
      if (!user)
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);

      this.queueService.forgotPasswordEmail({
        email: dto.email,
        userId: user.userId,
      });
      return 'An email was sent to your account with Reset Password link';
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      if (dto.newPassword !== dto.renewPassword)
        throw new HttpException(
          "Password doesn't matches",
          HttpStatus.BAD_REQUEST,
        );

      const user = await this.prisma.users.findUnique({
        where: { userId: +dto.userId },
      });
      if (!user)
        throw new HttpException(
          'Cannot find user for this request',
          HttpStatus.NOT_FOUND,
        );

      const hashedPassword = await hashString(dto.newPassword);

      await this.prisma.users.update({
        where: { userId: +dto.userId },
        data: { password: hashedPassword },
      });

      return 'Password Reset Successfully';
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async logout(
    dto: { access_token: string; refresh_token: string; playerId?: string },
    user: AuthUser,
  ) {
    try {
      await this.prisma.devices.deleteMany({
        where: { userId: user.userId, device: dto?.playerId },
      });

      const logged_out = await this.prisma.loginLogs.updateMany({
        where: {
          userId: user.userId,
          refreshToken: dto.refresh_token,
          companyId: user.company.companyId,
          expireAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
          logout: false,
        },
        data: { logout: true },
      });

      if (!logged_out)
        throw new HttpException(
          'Active login logs not found',
          HttpStatus.UNAUTHORIZED,
        );

      if (dto?.playerId)
        await this.prisma.devices.delete({
          where: { device: dto.playerId, userId: user.userId },
        });

      return 'Logout Successfully';
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async cleanDb() {
    await this.prisma.branch.deleteMany();
    await this.prisma.companySettings.deleteMany();
    await this.prisma.users.deleteMany();
    await this.prisma.company.deleteMany();
    return 'DB Successfully Cleaned';
  }

  async refresh(dto: RefreshDto) {
    const refresh = await this.prisma.loginLogs.findFirst({
      where: {
        companyId: dto.companyId,
        logout: false,
        expireAt: {
          gte: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
        },
        refreshToken: dto.refresh_token,
        userId: dto.userId,
      },
      select: { loginLogsId: true },
    });

    if (!refresh)
      throw new HttpException(
        'Refresh token is already expired',
        HttpStatus.NOT_ACCEPTABLE,
      );
  }

  generateToken(user: AuthUser) {
    try {
      const access_token = this.jwtService.sign(user);
      const refresh_token = this.jwtService.sign(user, {
        expiresIn: ENV_CONSTANTS.JWT.REFRESH_EXPIRY,
      });
      return { access_token, refresh_token };
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
