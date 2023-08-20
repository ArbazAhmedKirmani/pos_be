import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ENV_CONSTANTS } from 'src/constants/env.constant';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async sendEmail(email: string | Array<string>, contextObject: any) {
    await this.mailerService.sendMail({
      to: Array.isArray(email) ? email : [email],
      subject: contextObject.subject,
      template: contextObject.template,
      context: contextObject.context,
    });
  }
}
