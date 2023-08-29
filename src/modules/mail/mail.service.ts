import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async sendEmail(email: string | Array<string>, contextObject: any) {
    try {
      await this.mailerService.sendMail({
        to: Array.isArray(email) ? email : [email],
        subject: contextObject.subject,
        template: contextObject.template,
        context: contextObject.context,
      });
      console.info('Email sent to:\n', email);
    } catch (error) {
      console.error(error);
    }
  }
}
