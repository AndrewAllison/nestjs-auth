import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { PasswordService } from './services/password.service';
import { RegistrationService } from './services/registration.service';
import { RegistrationController } from './controllers/registration.controller';
import { UserMapper } from './services/user-mapper.service';

@Module({
  imports: [CoreModule],
  providers: [RegistrationService, PasswordService, UserMapper],
  controllers: [RegistrationController],
})
export class AuthModule {}
