import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { userEntityValid } from '../../__testing__/data/user-entity.valid';
import { RegistrationService } from '../services/registration.service';
import { UserMapper } from '../services/user-mapper.service';
import { RegistrationController } from './registration.controller';

describe('RegistrationController', () => {
  let controller: RegistrationController;
  const mockUserService = mock<RegistrationService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: RegistrationService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<RegistrationController>(RegistrationController);
    mockUserService.register.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('register', () => {
    it('should allow a user to register with the correct details', async () => {
      const registrationDetails = {
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'hp1@hogwarts.edu.org',
        password: 'H6dQ**',
        displayName: 'The Chosen one',
      };

      const userDto = UserMapper.flattern(userEntityValid);
      mockUserService.register.mockReturnValue(
        new Promise<any>((resolve) => {
          return resolve(userDto);
        }),
      );

      const results = await controller.register(registrationDetails);

      expect(results).toEqual(userDto);
    });
  });
});
