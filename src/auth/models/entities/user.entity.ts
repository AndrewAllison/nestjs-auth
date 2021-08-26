export class RoleEntity {
  id: string;
  name: string;
  description: string;

  createdAt: Date;
  modifiedAt: Date;
}

export class ProviderEntity {
  id: string;
  email: string;
  provider: string;
  token: string;

  createdAt: Date;
  modifiedAt: Date;
}

export class UserEntity {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  roles?: RoleEntity[];
  providers?: ProviderEntity[];

  createdAt: Date;
  modifiedAt: Date;
}
