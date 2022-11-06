import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { HttpExceptionFilter } from './Filters/httpException.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global Middleware
  app.use(helmet());
  app.enableCors({ credentials: true, origin: process.env.CLIENT_URL });

  // CUSTOM ERROR EXCEPTION
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
