import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  const mockPrismaService = mock<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: LoginService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('attemptLogin', () => {
    it('should request a user when logging in', () => {
      const mockedMethod = mockPrismaService.user.findUnique;
      const logRequest = {
        email: 'hp1@hogwarts.edu.org',
        password: 'It$&ott*Secure',
      };

      const result = service.attemptLogin(logRequest);
      //
      // expect(mockedMethod).toHaveBeenLastCalledWith('hp1@hogwarts.edu.org');
    });
  });
});
