import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectPipes, InjectSwagger } from './utils/injectors';
import { AppConfig } from './config/app.config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
  });

  app.enableVersioning({ type: VersioningType.URI });

  InjectPipes(app);
  InjectSwagger(app);

  await app.listen(AppConfig.APP.PORT || 3333);
}
bootstrap();
