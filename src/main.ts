import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Use the PORT from the environment, or 3001 if it's not set
  const port = process.env.PORT || 3001;

  await app.listen(port);
}
bootstrap();
