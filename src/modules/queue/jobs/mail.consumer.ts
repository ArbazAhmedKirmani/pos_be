import { Processor, Process, OnQueueFailed, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { CONTEXT_CONSTANT } from 'src/constants/context.constant';
import { AppConfig } from 'src/config/app.config';
import { MailService } from 'src/modules/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ForgotEmailProcess } from 'src/utils/interfaces';

@Processor(AppConfig.BULL.QUEUE.MAIL)
export class MailConsumer {
  constructor(private mailService: MailService) {}

  @Process(AppConfig.BULL.JOBS.FORGOT_EMAIL)
  async sendForgotEmailProcess(job: Job<ForgotEmailProcess>) {
    const { email, userId, fullname } = job.data;

    const contextObject = CONTEXT_CONSTANT.FORGOT_EMAIL({
      fullname,
      userId,
    });
    await this.mailService.sendEmail(email, contextObject);
  }

  @Process(AppConfig.BULL.JOBS.SIGNUP_EMAIL)
  async sendSignupEmailProcess(
    job: Job<{
      email: string;
      fullname: string;
      userId: number;
    }>,
  ) {
    const { email } = job.data;

    const contextObject = CONTEXT_CONSTANT.SIGNUP_EMAIL(job.data);
    await this.mailService.sendEmail(email, contextObject);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    console.log(
      `${JSON.stringify(job)} JOB \n`,
      `${job.id} with name ${job.name} got FAILED. below is the log`,
    );
    console.error(err, err?.name, '\n', err?.message);
  }

  @OnQueueError()
  onQueueError(job: Job, err: Error) {
    console.log(
      `${JSON.stringify(job)} JOB \n`,
      `${job.id} with name ${job.name} got an ERROR. below is the log`,
    );
    console.error(JSON.stringify(err), err?.name, '\n', err?.message);
  }
}
