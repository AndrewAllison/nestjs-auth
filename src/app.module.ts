import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [ConfigModule, LogModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
