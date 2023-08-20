import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_CONSTANTS } from 'src/constants/env.constant';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: ENV_CONSTANTS.JWT.SECRET_KEY,
        signOptions: {
          expiresIn: ENV_CONSTANTS.JWT.ACCESS_EXPIRY,
        }, // Token expiration time
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtAuthModule {}
