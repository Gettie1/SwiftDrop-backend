import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(helmet());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4001;

  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
void bootstrap();
