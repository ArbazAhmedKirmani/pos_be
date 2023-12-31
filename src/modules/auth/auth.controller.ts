import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalLoginDto } from './dto/locallogin.dto';
import { SkipAuth, User } from 'src/utils/decorators';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LocalSignupDto,
  RefreshDto,
  ResetPasswordDto,
} from './dto';
import { LoginResponse } from './interface';
import { RefreshJwtAuthGuard } from 'src/utils/guards/refresh-jwt.guard';
import { AuthUser } from 'src/utils/interfaces';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @ApiHeader({ name: 'locale' })
  @Post('/local/login')
  async loginLocal(@Body() dto: LocalLoginDto): Promise<LoginResponse> {
    const result: LoginResponse = await this.authService.loginLocal(dto);
    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'locale' })
  @SkipAuth()
  @Post('/local/signup')
  async signupLocal(@Body() dto: LocalSignupDto) {
    return await this.authService.signupLocal(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'locale' })
  @UseGuards(RefreshJwtAuthGuard)
  @SkipAuth()
  @Post('/refresh')
  async refreshToken(@Body() dto: RefreshDto, @User() user: AuthUser) {
    return this.authService.refresh(dto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @SkipAuth()
  @ApiHeader({ name: 'locale' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'locale' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @ApiBearerAuth('access_token')
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'locale' })
  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: AuthUser) {
    return await this.authService.changePassword(dto, user);
  }

  @ApiBearerAuth('access_token')
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Body()
    dto: { access_token: string; refresh_token: string; playerId?: string },
    @User() user: AuthUser,
  ) {
    return await this.authService.logout(dto, user);
  }

  @ApiTags('Clean DB')
  @SkipAuth()
  @Get('clean-db')
  async cleanDb() {
    return await this.authService.cleanDb();
  }
}
