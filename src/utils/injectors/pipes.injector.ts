import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { I18nValidationPipe } from 'nestjs-i18n';

export function InjectPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: true, value: true },
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
    new I18nValidationPipe(),
  );
}
