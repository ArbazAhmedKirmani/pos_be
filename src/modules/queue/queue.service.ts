import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { ForgotEmailProcess, NotificationProcess } from 'src/utils/interfaces';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(ENV_CONSTANTS.BULL.QUEUE.MAIL) private mailQueue: Queue,
    @InjectQueue(ENV_CONSTANTS.BULL.QUEUE.NOTIFICATION)
    private notificationQueue: Queue,
  ) {}

  forgotPasswordEmail(jobData: ForgotEmailProcess) {
    this.mailQueue.add(ENV_CONSTANTS.BULL.JOBS.FORGOT_EMAIL, jobData, {
      lifo: false,
    });
  }

  signupEmail(jobData) {
    this.mailQueue.add(ENV_CONSTANTS.BULL.JOBS.SIGNUP_EMAIL, jobData, {
      lifo: false,
    });
  }

  sendNotification(jobData: NotificationProcess) {
    this.notificationQueue.add(
      ENV_CONSTANTS.BULL.JOBS.SEND_NOTIFICATION,
      jobData,
      { lifo: false },
    );
  }
}
