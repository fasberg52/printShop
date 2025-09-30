import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const swaggerPath = process.env.SWAGGER_PATH || 'api-docs';
  const title = process.env.SWAGGER_TITLE || 'API Documentation';
  const description = process.env.SWAGGER_DESCRIPTION || 'API description';

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0.0')
    .addBearerAuth() // For API endpoints that use Bearer token
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  console.log(`Swagger documentation is running on /${swaggerPath}`);
}
