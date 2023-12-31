import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LocalLoginDto } from './dto/locallogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  compareHashString,
  hashString,
} from 'src/helpers/hashAndEncrypt.helper';
import { LoginResponse } from './interface/loginResponse.interface';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from 'src/config/app.config';
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
  OrderStatus,
  UserRole,
} from '@prisma/client';
import { QueueService } from '../queue/queue.service';
import { Default_Company_Settings } from 'src/data/helper.data';
import { I18nTranslate } from 'src/helpers';
import { i18n_constants } from 'src/constants/i18n.constant';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private queueService: QueueService,
    private i18n: I18nTranslate,
    private cacheService: CacheService,
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
          this.i18n.translate('auth.not_found'),
          // "User you're trying to authenticate doesn't exists",
          HttpStatus.NOT_FOUND,
        );

      if (!user.isEmailVerified)
        throw new HttpException(
          this.i18n.translate('auth.email_verified'),
          // 'Your Email is not verified. Please verify your email and try again',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      if (!user.isApproved)
        throw new HttpException(
          this.i18n.translate('auth.not_approved'),
          // 'Unfortunately! Your Account is not already approved by the company. Please be patient as we are verifying your account',
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
        throw new ConflictException(i18n_constants.responses.auth.signin_limit);

      const isMatched = await compareHashString(dto.password, user.password);

      if (!isMatched)
        throw new NotFoundException(i18n_constants.responses.error.not_found);

      delete user.password;

      const { access_token, refresh_token } = this.generateToken(user);

      this.cacheService.Set(user.userId.toString(), {
        ...user,
        access_token: [access_token],
      });

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
        message: this.i18n.translate('response.auth.success'),
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

      const hashPassword = await hashString(AppConfig.DEFAULT_PASSWORD);

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

      if (dto?.playerId)
        await this.prisma.devices.create({
          data: {
            device: dto.playerId,
            userId: user.userId,
          },
        });

      this.queueService.signupEmail({
        userId: user.userId,
        email: dto.email,
        fullname: user.fullname,
        companyName: dto.companyName,
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
      const user = await this.prisma.users.findUnique({
        where: { email: dto.email },
        select: { userId: true, fullname: true, email: true },
      });
      if (!user)
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);

      this.queueService.forgotPasswordEmail({
        email: user.email,
        fullname: user.fullname,
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
      const access_token = this.jwtService.sign({ sub: user.userId });
      const refresh_token = this.jwtService.sign(
        { sub: user.userId },
        {
          expiresIn: AppConfig.JWT.REFRESH_EXPIRY,
        },
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
