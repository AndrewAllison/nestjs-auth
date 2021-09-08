import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from '../core/config/jwt.config';
import { CoreModule } from '../core/core.module';
import { RegistrationController } from './controllers/registration.controller';
import { UsersController } from './controllers/users.controller';
import { CryptoService } from './services/crypto.service';
import { RegistrationService } from './services/registration.service';
import { UserMapper } from './services/user-mapper.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.stratergy';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';
import { RoleService } from './services/role.service';
import { PasswordService } from './services/password.service';
import { AuthResolver } from './resolvers/auth.resolver';

@Module({
  controllers: [RegistrationController, UsersController, LoginController],
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
    CryptoService,
    RegistrationService,
    UserMapper,
    UserService,
    LoginService,
    RoleService,
    PasswordService,
    AuthResolver,
  ],
})
export class AuthModule {}
