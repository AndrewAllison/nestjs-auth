import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { mapError } from '../../core/data/prisma/handle-prisma-error';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LogService } from '../../core/log/log.service';
import { UserRegisterInput } from '../models/requests/user-register.input';
import { CryptoService } from './crypto.service';
import { createProviderDetails, determineRolestoAdd } from './functions';
import { UserMapper } from './user-mapper.service';

export const DEFAULT_ROLES = ['User'];

@Injectable()
export class RegistrationService {
  logger = new LogService(RegistrationService.name);

  constructor(
    private prisma: PrismaService,
    private passwordHelper: CryptoService,
  ) {
    this.logger.setContext(RegistrationService.name);
  }

  public async register({
    firstName,
    lastName,
    email,
    password,
  }: UserRegisterInput) {
    const createData = {
      id: uuid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: '',
      displayName: `${firstName.trim()} ${lastName.trim()}`,
      roles: { connect: determineRolestoAdd(['User']) },
      providers: { create: [] },
    };

    const { hash, salt } = this.passwordHelper.createPasswordHash(password);

    // If we have a user from a social provider there will be no password.
    const providerDetails = createProviderDetails({
      email,
      token: salt,
    });
    createData.password = hash;
    createData.providers.create.push(providerDetails);
    try {
      const userEntity = await this.prisma.user.create({
        data: createData,
        include: {
          roles: true,
          providers: true,
        },
      });
      return { success: true, payload: UserMapper.flattern(userEntity) };
    } catch (e) {
      this.logger.error({ acrion: 'user-registration', stackTrace: e });
      return { error: mapError(e, 'Register') };
    }
  }
}
