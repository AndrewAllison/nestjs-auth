import { Test, TestingModule } from '@nestjs/testing';
import { mockLoginService } from '../../__testing__/mocks/login-service.mock';
import { mockRegistrationService } from '../../__testing__/mocks/registration-service.mock';
import { LoginService } from '../services/login.service';
import { RegistrationService } from '../services/registration.service';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: RegistrationService,
          useValue: mockRegistrationService,
        },
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
