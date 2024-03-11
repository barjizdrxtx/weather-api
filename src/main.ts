import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Load environment variables as soon as possible
require('dotenv').config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // Enable CORS for all origins
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  

  await app.listen(5000);
}

bootstrap();
