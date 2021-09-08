import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../../core/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtConfig = configService.get<JwtConfig>('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer: jwtConfig.issuer,
      aud: jwtConfig.audience,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: unknown): Promise<unknown> {
    return payload;
  }
}
