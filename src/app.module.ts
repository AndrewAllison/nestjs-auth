import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [AuthModule, CoreModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
