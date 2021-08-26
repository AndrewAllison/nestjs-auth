import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from '../core/config/jwt.config';
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
  imports: [
    CoreModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>('jwt');
        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
          },
        };
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    JwtStrategy,
    PasswordService,
    RegistrationService,
    UserMapper,
    UsersService,
  ],
})
export class AuthModule {}
