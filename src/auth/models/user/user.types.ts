import { LoginFailed, Provider, Role, User } from '@prisma/client';

export interface UserDetailsWithRoles extends Omit<User, 'password' | 'roles'> {
  roles: string[];
  prviders?: string[];
}

export interface UserDetails extends User {
  roles: Role[];
  providers: Provider[];
}

export interface UserWithLoginDetails extends User {
  failedLogins: LoginFailed[];
}
