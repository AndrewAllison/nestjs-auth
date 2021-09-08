import { AUTH_PROVIDERS } from '../../auth/consts/provider.types';
import { UserDetails } from '../../auth/models/user';

export const userEntityValid = {
  id: '123-456-789',
  firstName: 'Harry',
  lastName: 'Potter',
  displayName: 'The Chosen One',
  email: 'hp1@hogqarts.edu.org',
  password: '123439872047032820187',
  createdAt: new Date(1991, 9, 1),
  modifiedAt: new Date(1991, 9, 1),
  roles: [
    {
      id: '99-99-99',
      name: 'User',
      description: 'A user',
      createdAt: new Date(1991, 9, 1),
      modifiedAt: new Date(1991, 9, 1),
    },
  ],
  providers: [
    {
      id: '776-889-998',
      email: 'hp1@hogqarts.edu.org',
      provider: AUTH_PROVIDERS.EMAIL,
      token: '783y9rjh834gi7refh8f7i4h4378dihg2fyhyubgyedhyru',
      createdAt: new Date(1991, 9, 1),
      modifiedAt: new Date(1991, 9, 1),
    },
  ],
} as UserDetails;
