import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { AppConfig } from 'src/config/app.config';
import { ForgotEmailProcess, NotificationProcess } from 'src/utils/interfaces';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(AppConfig.BULL.QUEUE.MAIL) private mailQueue: Queue,
    @InjectQueue(AppConfig.BULL.QUEUE.NOTIFICATION)
    private notificationQueue: Queue,
  ) {}

  forgotPasswordEmail(jobData: ForgotEmailProcess) {
    this.mailQueue.add(AppConfig.BULL.JOBS.FORGOT_EMAIL, jobData, {
      lifo: false,
    });
  }

  signupEmail(jobData: {
    email: string;
    fullname: string;
    companyName: string;
    userId: number;
  }) {
    this.mailQueue.add(AppConfig.BULL.JOBS.SIGNUP_EMAIL, jobData, {
      lifo: false,
    });
  }

  sendNotification(jobData: NotificationProcess) {
    this.notificationQueue.add(AppConfig.BULL.JOBS.SEND_NOTIFICATION, jobData, {
      lifo: false,
    });
  }
}
