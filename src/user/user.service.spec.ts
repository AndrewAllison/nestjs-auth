import { Test, TestingModule } from '@nestjs/testing';
import { anyString } from 'jest-mock-extended';
import { v4 as uuid } from 'uuid';
import {
  mockedHashValue,
  mockedSalt,
  mockPasswordService,
} from '../__testing__/mocks/password-service.mock';
import { mockPrismaService } from '../__testing__/mocks/prisma-service.mock';
import { PrismaService } from '../core/data/prisma/prisma.service';
import { PasswordService } from './password.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    it('should register a new user with some info', () => {
      const createInstance = jest.spyOn(mockPrismaService.user, 'create');
      const passwordSpy = jest
        .spyOn(mockPasswordService, 'createPasswordHash')
        .mockReturnValue({ hash: mockedHashValue, salt: mockedSalt });

      const userId = uuid();
      service.register({
        id: userId,
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'hp1@hogwartz.edu.org',
        password: '1232432342',
      });

      expect(passwordSpy).toHaveBeenLastCalledWith('1232432342');

      expect(createInstance).toHaveBeenLastCalledWith({
        data: {
          id: userId,
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
      });
    });
    it('should make sure info is trimmed info', () => {
      const createInstance = jest.spyOn(mockPrismaService.user, 'create');
      const passwordSpy = jest
        .spyOn(mockPasswordService, 'createPasswordHash')
        .mockReturnValue({ hash: mockedHashValue, salt: mockedSalt });

      service.register({
        id: uuid(),
        firstName: '   Harry    ',
        lastName: '   Potter    ',
        email: '   HP1@hogwartz.edu.org   ',
        password: '12345678',
      });

      const expectedResult = {
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
      };

      expect(passwordSpy).toHaveBeenLastCalledWith('12345678');
      expect(createInstance).toHaveBeenLastCalledWith(expectedResult);
    });
    it('should use displayName if present', () => {
      const createInstance = jest.spyOn(mockPrismaService.user, 'create');
      const passwordSpy = jest
        .spyOn(mockPasswordService, 'createPasswordHash')
        .mockReturnValue({ hash: mockedHashValue, salt: mockedSalt });

      service.register({
        id: uuid(),
        displayName: 'The Chosen One',
        firstName: '   Harry    ',
        lastName: '   Potter    ',
        email: '   HP1@hogwartz.edu.org   ',
        password: '12345678',
      });

      const expectedResult = {
        data: {
          id: anyString(),
          firstName: 'Harry',
          lastName: 'Potter',
          displayName: 'The Chosen One',
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
      };

      expect(passwordSpy).toHaveBeenLastCalledWith('12345678');
      expect(createInstance).toHaveBeenLastCalledWith(expectedResult);
    });
    it('should use an id fied when it is present', () => {
      const createInstance = jest.spyOn(mockPrismaService.user, 'create');
      const passwordSpy = jest
        .spyOn(mockPasswordService, 'createPasswordHash')
        .mockReturnValue({ hash: mockedHashValue, salt: mockedSalt });

      service.register({
        id: '12345678',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'hp1@hogwartz.edu.org',
        password: '12345678',
      });

      expect(passwordSpy).toHaveBeenLastCalledWith('12345678');

      expect(createInstance).toHaveBeenLastCalledWith({
        data: {
          id: '12345678',
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
      });
    });
  });
});
