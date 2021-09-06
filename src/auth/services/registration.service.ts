import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { mapError } from '../../core/data/prisma/errors/handle-prisma-error';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LogService } from '../../core/log/log.service';
import { ErrorResponse } from '../../core/models/error-response.model';
import { UserRegisterInput } from '../models/requests/user-register.input';
import { UserDetailsWithRoles } from '../models/user';
import { CryptoService } from './crypto.service';
import { createProviderDetails, determineRolestoAdd } from './functions';
import { UserMapper } from './user-mapper.service';

export const DEFAULT_ROLES = ['User'];

/**
 * Class dealing with aspects of user registrations
 */
@Injectable()
export class RegistrationService {
  logger = new LogService(RegistrationService.name);

  /**
   * Creates an instance of the class with the desirede dependencies
   * @param {PrismaService} prisma Instance of a PrsimaService
   * @param {CryptoService} passwordHelper Instance of a CryptoService
   */
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
  }: UserRegisterInput): Promise<UserDetailsWithRoles | ErrorResponse> {
    const registrationDetails = this.mapInputData(firstName, lastName, email);

    const { hash, salt } = this.passwordHelper.createPasswordHash(password);

    // If we have a user from a social provider there will be no password.
    const providerDetails = createProviderDetails({
      email,
      token: salt,
    });
    registrationDetails.password = hash;
    registrationDetails.providers.create.push(providerDetails);
    try {
      const userEntity = await this.prisma.user.create({
        data: registrationDetails,
        include: {
          roles: true,
          providers: true,
        },
      });
      return UserMapper.flattern(userEntity);
    } catch (e) {
      this.logger.error({ acrion: 'user-registration', stackTrace: e });
      return { error: mapError(e, 'Register') };
    }
  }

  private mapInputData(firstName: string, lastName: string, email: string) {
    const registrationDetails = {
      id: uuid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: '',
      displayName: `${firstName.trim()} ${lastName.trim()}`,
      roles: { connect: determineRolestoAdd(['User']) },
      providers: { create: [] },
    };
    return registrationDetails;
  }
}
