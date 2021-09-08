import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [AuthModule, EventEmitterModule.forRoot(), CoreModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
