import { Processor, Process, OnQueueFailed, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { CONTEXT_CONSTANT } from 'src/constants/context.constant';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { MailService } from 'src/modules/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ForgotEmailProcess } from 'src/utils/interfaces';

@Processor(ENV_CONSTANTS.BULL.QUEUE.MAIL)
export class MailConsumer {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  @Process(ENV_CONSTANTS.BULL.JOBS.FORGOT_EMAIL)
  async sendForgotEmailProcess(job: Job<ForgotEmailProcess>) {
    const { email, userId } = job.data;
    const user = await this.prisma.users.findUnique({
      where: { userId: userId },
      select: { fullname: true },
    });

    const contextObject = CONTEXT_CONSTANT.FORGOT_EMAIL({
      name: user.fullname,
      email,
      url: `${ENV_CONSTANTS.APP.FRONTEND_URL}/auth/reset-password/${userId}`,
    });
    await this.mailService.sendEmail(email, contextObject);
  }

  @Process(ENV_CONSTANTS.BULL.JOBS.SIGNUP_EMAIL)
  async sendSignupEmailProcess(
    job: Job<{ email: string; fullname: string; companyName: string }>,
  ) {
    debugger;
    console.log('Sending Signup Email');
    const { email, fullname, companyName } = job.data;

    const contextObject = CONTEXT_CONSTANT.SIGNUP_EMAIL({
      name: fullname,
      email,
      companyName,
    });
    await this.mailService.sendEmail(email, contextObject);
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
