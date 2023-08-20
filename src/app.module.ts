import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/app/users/users.module';
import { BranchModule } from './modules/app/branch/branch.module';
import { SocketModule } from './modules/socket/socket.module';
import { QueueModule } from './modules/queue/queue.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { JwtAuthModule } from './modules/jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from './utils/guards';
import { NotificationModule } from './modules/notification/notification.module';
import { AreasModule } from './modules/app/areas/areas.module';

@Module({
  imports: [
    AuthModule,
    MailModule,
    PrismaModule,
    UsersModule,
    BranchModule,
    SocketModule,
    QueueModule,
    JwtAuthModule,
    NotificationModule,
    AreasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}