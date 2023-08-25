import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailConsumer } from './jobs/mail.consumer';
import { NotificationConsumer } from './jobs/notification.consumer';

@Global()
@Module({
  imports: [
    BullModule.forRoot('basic-config', {
      redis: {
        host: ENV_CONSTANTS.REDIS.HOST,
        port: ENV_CONSTANTS.REDIS.PORT,
      },
    }),
    BullModule.registerQueue({
      configKey: 'basic-config',
      name: ENV_CONSTANTS.BULL.QUEUE.MAIL,
    }),
    BullModule.registerQueue({
      configKey: 'basic-config',
      name: ENV_CONSTANTS.BULL.QUEUE.NOTIFICATION,
    }),
  ],

  providers: [
    QueueService,
    MailService,
    PrismaService,
    MailConsumer,
    NotificationConsumer,
  ],
  exports: [QueueService],
})
export class QueueModule {}
