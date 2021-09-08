import { Test, TestingModule } from '@nestjs/testing';
import { anyString } from 'jest-mock-extended';
import { userEntityValid } from '../../__testing__/data/user-entity.valid';
import {
  mockedHashValue,
  mockedSalt,
  mockPasswordService,
} from '../../__testing__/mocks/password-service.mock';
import { mockPrismaService } from '../../__testing__/mocks/prisma-service.mock';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { UserDetailsWithRoles } from '../models/user';
import { CryptoService } from './crypto.service';
import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CryptoService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    it('should register a new user with some info', async () => {
      const createInstance = jest
        .spyOn(mockPrismaService.user, 'create')
        .mockReturnValue(userEntityValid);
      const passwordSpy = jest
        .spyOn(mockPasswordService, 'createPasswordHash')
        .mockReturnValue({ hash: mockedHashValue, salt: mockedSalt });

      const result = await service.register({
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'hp1@hogwartz.edu.org',
        password: '1232432342',
      });

      expect(passwordSpy).toHaveBeenLastCalledWith('1232432342');

      expect(createInstance).toHaveBeenLastCalledWith({
        data: {
          id: anyString(),
          firstName: 'Harry',
          lastName: 'Potter',
          displayName: 'Harry Potter',
          email: 'hp1@hogwartz.edu.org',
          password: mockedHashValue,
          roles: {
            connect: [{ name: 'User' }],
          },
          providers: {
            create: [
              {
                email: 'hp1@hogwartz.edu.org',
                provider: 'emailAndPassword',
                token: mockedSalt,
              },
            ],
          },
        },
        include: {
          providers: true,
          roles: true,
        },
      });
      expect((result as UserDetailsWithRoles).displayName).toEqual(
        'The Chosen One',
      );
    });
    it('should make sure info is trimmed info', async () => {
      const createInstance = jest
        .spyOn(mockPrismaService.user, 'create')
        .mockReturnValue(userEntityValid);
      const passwordSpy = jest
        .spyOn(mockPasswordService, 'createPasswordHash')
        .mockReturnValue({ hash: mockedHashValue, salt: mockedSalt });

      const resut = await service.register({
        firstName: '   Harry    ',
        lastName: '   Potter    ',
        email: '   HP1@hogwartz.edu.org   ',
        password: '12345678',
      });

      const expectedToCallWith = {
        data: {
          id: anyString(),
          firstName: 'Harry',
          lastName: 'Potter',
          displayName: 'Harry Potter',
          email: 'hp1@hogwartz.edu.org',
          password: mockedHashValue,
          roles: {
            connect: [{ name: 'User' }],
          },
          providers: {
            create: [
              {
                email: 'hp1@hogwartz.edu.org',
                provider: 'emailAndPassword',
                token: '2134567uytrgewq3456',
              },
            ],
          },
        },
        include: {
          providers: true,
          roles: true,
        },
      };

      expect(passwordSpy).toHaveBeenLastCalledWith('12345678');
      expect(createInstance).toHaveBeenLastCalledWith(expectedToCallWith);
    });
  });
});
