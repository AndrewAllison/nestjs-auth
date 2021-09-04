import { Injectable } from '@nestjs/common';
import { Provider, Role, User } from '@prisma/client';
import { Mapper } from '../../core/data/mapper.service';
import { UserDetailsWithRoles } from '../models/user';

@Injectable()
export class UserMapper extends Mapper<User> {
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
