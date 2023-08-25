import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

export function InjectPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: true, value: true },
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
}
