import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslate } from 'src/helpers';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private i18n: I18nTranslate) {}
  catch(exception: unknown | Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message; // 'Something went wrong on our side. Please try again after some time';
    } else {
      status = 417;
      message = exception?.['message']; //'Expectation Failed. Please try again after some time';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.i18n.translate(message),
    });
  }
}
