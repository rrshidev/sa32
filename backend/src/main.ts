// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from '@nestjs/config';

// async function bootstrap(): Promise<void> {
//   const app = await NestFactory.create(AppModule);
//   const config = new DocumentBuilder()
//     .setTitle('SA32 API')
//     .setDescription('API для сервиса записи в автосервисы')
//     .setVersion('1.0')
//     .addBearerAuth() // Для JWT авторизации в Swagger
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
//   const configService = app.get(ConfigService);
//   console.log(configService.get<number>('DB_PORT'));
//   const port = configService.get<number>('APP_PORT') || 3000;
//   await app.listen(port);
//   console.log(`Server started on port ${port}`);
// }

// void bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ===== 1. Настройка глобального префикса API =====
  app.setGlobalPrefix('api');

  // ===== 2. Настройка CORS для фронтенда =====
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3001', // Docker frontend
      'http://localhost:3000', // Docker frontend fallback
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false, // Изменено на false для решения CORS проблем
    allowedHeaders: 'Content-Type,Authorization',
  });

  // ===== 3. Настройка валидации =====
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ===== 4. Настройка Swagger =====
  const config = new DocumentBuilder()
    .setTitle('SA32 API')
    .setDescription('API для сервиса записи в автосервисы')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ===== 5. Настройка для работы с WebApp =====
  app.use('/webapp', express.static(join(__dirname, '..', 'public')));

  // ===== 6. Запуск сервера =====
  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);

  console.log(`
  =====================================================
  🚀 Server started on port ${port}
  📄 Swagger: http://localhost:${port}/api
  🌐 CORS enabled for: localhost:5173, localhost:3001
  🔗 API prefix: /api
  =====================================================
  `);
}

void bootstrap();
