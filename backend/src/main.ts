import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Use process.cwd() instead of __dirname
  const uploadsDir = join(process.cwd(), 'uploads');

  // Make sure the folder exists
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at ${uploadsDir}`);
  }

  console.log(`📁 Serving uploads from: ${uploadsDir}`);

  // Use NestJS method instead of express.static directly
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // CORS
  app.enableCors();

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME') || 'NestJS Backend')
    .setDescription('API documentation for NestJS Backend')
    .setVersion(configService.get('APP_VERSION') || '1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
  console.log(`🖼️  Test image URL: http://localhost:${port}/uploads/a65c9971-c309-4160-8cfb-88f55c589f9b.jpg`);
}

bootstrap();