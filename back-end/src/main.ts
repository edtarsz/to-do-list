import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Hace la magia 
  app.enableCors({
    origin: app.get(ConfigService).get('FRONTEND_URL'),
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  // Sirve para validar los DTOs
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const PORT = app.get(ConfigService).get('PORT');

  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}
bootstrap();
