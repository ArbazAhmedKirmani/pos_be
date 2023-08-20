import { Processor, Process, OnQueueFailed, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { CONTEXT_CONSTANT } from 'src/constants/context.constant';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { MailService } from 'src/modules/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ForgotEmailProcess, NotificationProcess } from 'src/utils/interfaces';

@Processor(ENV_CONSTANTS.BULL.QUEUE.MAIL)
export class MailConsumer {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  @Process(ENV_CONSTANTS.BULL.JOBS.FORGOT_EMAIL)
  async sendNotificationProcess(job: Job<NotificationProcess>) {
    const { notificationType, message, device }: NotificationProcess = job.data;
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    console.log(`${job.id} with name ${job.name} got FAILED. below is the log`);
    console.error(err.name, '\n', err.message);
  }

  @OnQueueError()
  onQueueError(job: Job, err: Error) {
    console.log(
      `${job.id} with name ${job.name} got an ERROR. below is the log`,
    );
    console.error(err.name, '\n', err.message);
  }
}
