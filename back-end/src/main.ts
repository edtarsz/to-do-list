import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Habilitar CORS básico desde la creación
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  // Configuración detallada de CORS
  app.enableCors({
    origin: [
      'https://to-do-list-front-end-4r4j.onrender.com',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global prefix
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || configService.get('BACK_END_PORT') || 3000;

  await app.listen(PORT, '0.0.0.0');

  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for: https://to-do-list-front-end-4r4j.onrender.com`);
}

bootstrap();