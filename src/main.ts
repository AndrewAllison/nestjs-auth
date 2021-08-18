import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './config/models/env.config';
import { LogService } from './log/log.service';

let port;
let env;
let appUrl;
let logger;

const configureLogger = async (app: INestApplication) => {
  logger = await app.resolve(LogService);
  logger.setContext('NESTJS-API');
  app.useLogger(logger);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  await configureLogger(app);

  // config & env settings
  const configService = app.get(ConfigService);
  const envConfig = configService.get<EnvConfig>('env');
  port = envConfig.port;
  env = envConfig.env;

  await app.listen(port);
  appUrl = await app.getUrl();
}
bootstrap()
  .catch((e) => {
    logger.error({ stack: e }, `Error starting server`);
    console.error(e);
  })
  .then(() => {
    const startUpMessage = `[${env}] - Server Running ${appUrl}`;
    console.log(startUpMessage);
  });
