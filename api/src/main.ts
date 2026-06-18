import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const allowedOrigins = [
    'http://localhost:3004',
    'http://localhost:5173',
    'https://thelastcodebender.com',
    process.env.FRONTEND_URL,
  ].filter((o): o is string => !!o && !o.endsWith('/'));

  app.enableCors({
    origin: (origin, cb) => {
      // allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
