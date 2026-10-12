import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';


async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);


  app.enableCors({
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:4000',

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  });


  // ============================================================
  // VALIDACIÓN GLOBAL
  // ============================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  // ============================================================
  // INICIAR SERVIDOR
  // ============================================================

  await app.listen(
    process.env.PORT ?? 3000,
  );
}


bootstrap();