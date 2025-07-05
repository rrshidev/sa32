import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('SA32 API')
    .setDescription('API для сервиса записи в автосервисы')
    .setVersion('1.0')
    .addBearerAuth() // Для JWT авторизации в Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  console.log(configService.get<number>('DB_PORT'));
  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}

void bootstrap();
