import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
   app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  
      whitelist: true,   
      forbidNonWhitelisted: true, 
    }),
  );

    const config = new DocumentBuilder()
    .setTitle('Ryze API')
    .setDescription('Api for company')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  // ✅ Tell Swagger to use this scheme for *all* routes
  (config as any).security = [{ 'access-token': [] }];

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  //cors
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });

  await app.listen(3001);
}
bootstrap();
