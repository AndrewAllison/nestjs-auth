import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from '../core/core.module';
import { RegistrationController } from './controllers/registration.controller';
import { UsersController } from './controllers/users.controller';
import { PasswordService } from './services/password.service';
import { RegistrationService } from './services/registration.service';
import { UserMapper } from './services/user-mapper.service';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './strategies/jwt.stratergy';

@Module({
  controllers: [RegistrationController, UsersController],
  exports: [PassportModule],
  imports: [CoreModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtStrategy,
    PasswordService,
    RegistrationService,
    UserMapper,
    UsersService,
  ],
})
export class AuthModule {}
