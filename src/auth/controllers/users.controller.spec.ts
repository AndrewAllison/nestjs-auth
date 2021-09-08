import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { mockPasswordService } from '../../__testing__/mocks/password-service.mock';
import { PasswordService } from '../services/password.service';
import { UserService } from '../services/user.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUserService = mock<UserService>();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
