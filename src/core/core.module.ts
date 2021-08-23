import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LogModule } from './log/log.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [ConfigModule, LogModule, DataModule],
})
export class CoreModule {}
