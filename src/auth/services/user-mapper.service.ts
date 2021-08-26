import { Injectable } from '@nestjs/common';
import { Mapper } from '../../core/data/mapper.service';
import { UserProfileDto } from '../models/dtos/user-profile.dto';
import { UserEntity } from '../models/entities/user.entity';

@Injectable()
export class UserMapper extends Mapper<UserEntity> {
  public static toDto(userEntity: UserEntity) {
    const { roles, providers, ...rest } = userEntity;
    const mappedRoles = roles.map((r) => r.name);
    const mappedProviders = providers.map((p) => p.provider);
    return {
      ...rest,
      roles: mappedRoles,
      providers: mappedProviders,
    } as UserProfileDto;
  }
}
