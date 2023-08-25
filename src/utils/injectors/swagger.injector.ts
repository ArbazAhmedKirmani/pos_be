import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function InjectSwagger(app: INestApplication) {
  const v1Options = new DocumentBuilder()
    .setTitle('Point Of Sale')
    .setDescription('API documentation page for Point Of Sale')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    // FOR SESSION USAGE
    // .addSecurity('authorization', {
    //   type: 'apiKey',
    //   description: 'API Authorization',
    //   name: 'authorization',
    //   in: 'header',
    // })
    .build();

  const v1Document = SwaggerModule.createDocument(app, v1Options);
  SwaggerModule.setup('/v1/swagger', app, v1Document);
}
