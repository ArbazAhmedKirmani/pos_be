import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { AppConfig } from 'src/config/app.config';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailConsumer } from './jobs/mail.consumer';
import { NotificationConsumer } from './jobs/notification.consumer';

@Global()
@Module({
  imports: [
    BullModule.forRoot('basic-config', {
      redis: {
        host: AppConfig.REDIS.HOST,
        port: AppConfig.REDIS.PORT,
      },
    }),
    BullModule.registerQueue({
      configKey: 'basic-config',
      name: AppConfig.BULL.QUEUE.MAIL,
    }),
    BullModule.registerQueue({
      configKey: 'basic-config',
      name: AppConfig.BULL.QUEUE.NOTIFICATION,
    }),
  ],

  providers: [
    QueueService,
    MailService,
    // <-- Consumers -->
    MailConsumer,
    NotificationConsumer,
  ],
  exports: [QueueService],
})
export class QueueModule {}
