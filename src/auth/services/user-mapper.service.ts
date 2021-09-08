import { Injectable } from '@nestjs/common';
import { Provider, Role, User } from '@prisma/client';
import { UserDetailsWithRoles } from '../models/user';

/**
 * Class for dealing with user data transformation actions
 */
@Injectable()
export class UserMapper {
  /**
   * A method that will flattern a user object to make it a nice neat little object
   * @param userEntity {User} orginal user entity that provided by prisma
   * @returns {UserDetailsWithRoles} a flatter version of the user with mapped properties
   */
  public static flattern(
    userEntity: User & { roles?: Role[]; providers?: Provider[] },
  ) {
    const { roles = [], providers = [], ...rest } = userEntity;
    const mappedRoles = roles.map((r) => r.name);
    const mappedProviders = providers.map((r) => r.provider);
    return {
      ...rest,
      roles: mappedRoles,
      providers: mappedProviders,
    } as UserDetailsWithRoles;
  }
}
