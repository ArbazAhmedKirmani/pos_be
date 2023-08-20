import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ENV_CONSTANTS } from 'src/constants/env.constant';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: ENV_CONSTANTS.EMAIL.CONFIG.HOST,
        port: ENV_CONSTANTS.EMAIL.CONFIG.PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: ENV_CONSTANTS.EMAIL.CONFIG.USER,
          pass: ENV_CONSTANTS.EMAIL.CONFIG.PASSWORD,
        },
      },
      defaults: {
        from: ENV_CONSTANTS.EMAIL.CONFIG.FORM,
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
