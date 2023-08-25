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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from './utils/guards';
import { NotificationModule } from './modules/notification/notification.module';
import { AreasModule } from './modules/app/areas/areas.module';
import { SizeAndFlavourModule } from './modules/app/size-and-flavour/size-and-flavour.module';
import { GlobalExceptionFilter } from './utils/exceptions';
import { TableWaiterModule } from './modules/app/table-waiter/table-waiter.module';
import { CustomerModule } from './modules/app/customer/customer.module';
import { PaymentsModule } from './modules/app/payments/payments.module';

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
    SizeAndFlavourModule,
    TableWaiterModule,
    CustomerModule,
    PaymentsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
