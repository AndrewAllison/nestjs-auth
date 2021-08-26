import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { AUTH_PROVIDERS } from '../models/provider.types';
import {
  CreateRegistrationInput,
  UserRegistrationInput,
} from '../models/requests/create-registration.input';
import { PasswordService } from './password.service';
import { UserMapper } from './user-mapper.service';

export type ProviderDetails = {
  email: string;
  origin?: string;
  token: string;
};

export const DEFAULT_ROLES = ['User'];

@Injectable()
export class RegistrationService {
  constructor(
    private prisma: PrismaService,
    private passwordHelper: PasswordService,
  ) {}

  public async register({
    firstName,
    lastName,
    email,
    password,
  }: UserRegistrationInput) {
    const createData = {
      id: uuid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: '',
      displayName: `${firstName.trim()} ${lastName.trim()}`,
      roles: { connect: this.determineRolestoAdd(['User']) },
      providers: { create: [] },
    };

    const { hash, salt } = this.passwordHelper.createPasswordHash(password);

    // If we have a user from a social provider there will be no password.
    const providerDetails = this.createProviderDetails({
      email,
      token: salt,
    });
    createData.password = hash;
    createData.providers.create.push(providerDetails);

    const userEntity = await this.prisma.user.create({
      data: createData,
      include: {
        roles: true,
        providers: true,
      },
    });

    return UserMapper.toDto(userEntity);
  }

  createProviderDetails({
    email,
    origin = AUTH_PROVIDERS.EMAIL,
    token,
  }: ProviderDetails) {
    const providerDetails = {
      email: email.trim().toLowerCase(),
      token: token,
      provider: origin,
    };

    return providerDetails;
  }

  determineRolestoAdd(roles: string[]) {
    const hasValidRoles = (roles) => {
      return roles && roles.length > 0;
    };
    return (hasValidRoles(roles) ? roles : DEFAULT_ROLES).reduce(
      (previouse, current) => {
        previouse.push({ name: current });
        return previouse;
      },
      [],
    );
  }
}
