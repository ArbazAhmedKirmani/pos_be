import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectPipes, InjectSwagger } from './utils/injectors';
import { ENV_CONSTANTS } from './constants/env.constant';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
  });

  app.enableVersioning({ type: VersioningType.URI });

  InjectPipes(app);
  InjectSwagger(app);

  await app.listen(ENV_CONSTANTS.APP.PORT || 3333);
}
bootstrap();
