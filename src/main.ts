import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(+process.env.APP_PORT);
}

void bootstrap();
