import { Test, TestingModule } from '@nestjs/testing';
import { mockPrismaService } from '../../__testing__/mocks/prisma-service.mock';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { USER_SELECT_BASIC } from '../querires';
import { UserService } from './user.service';

const userCreateDetails = {
  id: '123-345-6575',
  firstName: 'Harry',
  lastName: 'Potter',
  displayName: 'The Chosen One',
  email: 'hp1@hogwarts.edu.org',
};

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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with the prisma client', async () => {
      const expectedResult = {
        ...userCreateDetails,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(mockPrismaService.user, 'create')
        .mockReturnValue(expectedResult);

      const result = await service.create(userCreateDetails);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...userCreateDetails,
        },
        select: USER_SELECT_BASIC,
      });
    });
  });
});
