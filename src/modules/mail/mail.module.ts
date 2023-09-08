import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppConfig } from 'src/config/app.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: AppConfig.EMAIL.CONFIG.HOST,
        port: AppConfig.EMAIL.CONFIG.PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: AppConfig.EMAIL.CONFIG.USER,
          pass: AppConfig.EMAIL.CONFIG.PASSWORD,
        },
      },
      defaults: {
        from: AppConfig.EMAIL.CONFIG.FORM,
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
})
export class MailModule {}
