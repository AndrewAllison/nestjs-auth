import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../src/auth/services/crypto.service';
import config from './config';

const getJwtService = () =>
  new JwtService({
    secret: config.jwt.secret,
    signOptions: {
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      expiresIn: config.jwt.expiresIn,
    },
  });

const getCrytoService = (jwtService?: JwtService) =>
  new CryptoService(jwtService ? jwtService : getJwtService());

export { getCrytoService, getJwtService };
