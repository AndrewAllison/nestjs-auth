import { Test, TestingModule } from '@nestjs/testing';
import { userEntityValid } from '../../__testing__/data/user-entity.valid';
import { AUTH_PROVIDERS } from '../consts/provider.types';
import { UserMapper } from './user-mapper.service';

describe('UserMapperService', () => {
  let service: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMapper],
    }).compile();

    service = module.get<UserMapper>(UserMapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('toDto', () => {
    it('should map a user entity to a dto', () => {
      const userEntity = userEntityValid;
      const expectedDTO = {
        id: '123-456-789',
        firstName: 'Harry',
        lastName: 'Potter',
        displayName: 'The Chosen One',
        email: 'hp1@hogqarts.edu.org',
        password: '123439872047032820187',
        createdAt: new Date(1991, 9, 1),
        modifiedAt: new Date(1991, 9, 1),
        roles: ['User'],
        providers: [AUTH_PROVIDERS.EMAIL],
      };

      const result = UserMapper.flattern(userEntity);

      expect(result).toEqual(expectedDTO);
    });
  });
});
