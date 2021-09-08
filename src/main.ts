import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import passport from 'passport';
import { AppModule } from './app.module';
import { EnvConfig } from './core/config/models/env.config';
import { PrismaService } from './core/data/prisma/prisma.service';
import { LogService } from './core/log/log.service';

import * as packageJson from '../package.json';
import helmet from 'helmet';

let port;
let env;
let appUrl;
let logger;

const configureSecurity = (app: INestApplication) => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
};

const configureLogger = async (app: INestApplication) => {
  logger = await app.resolve(LogService);
  logger.setContext('NESTJS-API');
  app.useLogger(logger);
};

const configureSwaggerDocumentation = (
  app: INestApplication,
  packageDetails,
  params: { title; description },
) => {
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: params.title,
  };
  const config = new DocumentBuilder()
    .setTitle(packageDetails.name)
    .setDescription(params.description)
    .setVersion(packageDetails.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, customOptions);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  await configureLogger(app);
  await configureSwaggerDocumentation(app, packageJson, {
    title: 'API',
    description: 'API documentation',
  });
  // config & env settings
  const configService = app.get(ConfigService);
  const envConfig = configService.get<EnvConfig>('env');
  port = envConfig.port;
  env = envConfig.env;

  await configureSecurity(app);

  // handle prisma shutdown
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
      validationError: { value: false },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();

  await app.listen(port);
  appUrl = await app.getUrl();
  logger.debug({ port, env, appUrl: app.getUrl() }, '[Startup] environment');
}
bootstrap()
  .catch((e) => {
    logger.error({ stack: e }, `Error starting server`);
    console.error(e);
  })
  .then(() => {
    const startUpMessage = `[${env}] - Server Running ${appUrl}`;
    logger.info(startUpMessage);
    console.log(startUpMessage);
  });
