import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { HeaderResolver, I18nMiddleware, I18nModule } from 'nestjs-i18n';
import { AppConfig } from './config/app.config';
import { join } from 'path';
import { CustomersModule } from './modules/app/customers/customers.module';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: AppConfig.I18N.FALLBACK_LANG, //configService.getOrThrow('FALLBACK_LANGUAGE'),
        disableMiddleware: false,
        fallbacks: {
          en: 'en',
          ur: 'ur',
        },
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [new HeaderResolver(['locale'])],
      inject: [],
    }),
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
    CustomersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    AppService,
    PrismaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
