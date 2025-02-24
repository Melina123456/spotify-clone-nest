import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PreconditionFailedException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomHttpExceptionFilter } from './common/exception-filter/httpException.filter';
import { ValidationError } from 'class-validator';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (error: ValidationError[]) => {
        const e = error.map((er) => {
          return {
            target: er.property,
            message: er.constraints && Object.values(er.constraints)[0],
          };
        });
        throw new PreconditionFailedException(e);
      },
    }),
  );
  app.useGlobalFilters(new CustomHttpExceptionFilter());
  // you can enable seeding here
  // const seedService = app.get(SeedService);
  // await seedService.seed();

  const config = new DocumentBuilder()
    .setTitle('Spotify Clone')
    .setDescription('The Spotify Api Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
      //  We will use this Bearer Auth with JWT-auth name on the controller function
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
  console.log(configService.get<string>('NODE_ENV'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
