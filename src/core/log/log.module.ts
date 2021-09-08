import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { createStream } from 'pino-seq';
import { LogConfig } from '../config/models/log.config';
import { LogService } from './log.service';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const logConfig = config.get<LogConfig>('logging');
        const seqStream = createStream({
          serverUrl: logConfig.seqServerUrl,
          apiKey: logConfig.seqApiKey,
          logOtherAs: 'Verbose',
        });
        return {
          pinoHttp: [
            {
              level: logConfig.level,
              autoLogging: logConfig.autoLogging,
            },
            seqStream,
          ],
        };
      },
    }),
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
