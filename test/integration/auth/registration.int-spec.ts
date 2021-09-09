import { JwtService } from '@nestjs/jwt';
import dotenv from 'dotenv';
import faker from 'faker';
import { readFileSync } from 'fs';
import { anyString } from 'jest-mock-extended';
import { join } from 'path';
import { UserRegisterInput } from '../../../src/auth/models/requests/user-register.input';
import { UserDetailsWithRoles } from '../../../src/auth/models/user';
import { CryptoService } from '../../../src/auth/services/crypto.service';
import { RegistrationService } from '../../../src/auth/services/registration.service';
import { PrismaService } from '../../../src/core/data/prisma/prisma.service';
import { ErrorResponse } from '../../../src/core/models/error-response.model';
import config from '../../_common/config';

import {
  getCrytoService,
  getJwtService,
} from '../../_common/service-factories';
import { importRoles } from '../../_common/test-data';

dotenv.config({
  path: '.env.test',
});

describe('reistration-service', () => {
  let crypto: CryptoService;
  let jwtService: JwtService;
  let prisma: PrismaService;
  let registration: RegistrationService;
  beforeAll(async () => {
    if (config.integration.databaseUrl.indexOf('auth-test') <= 0) {
      throw new Error('Do not run integrations on databases other that test');
    }
    prisma = new PrismaService();
    jwtService = getJwtService();
    crypto = getCrytoService(jwtService);
    registration = new RegistrationService(prisma, crypto);
    await prisma.$executeRaw('TRUNCATE "User" CASCADE');
    await importRoles(prisma, `../../prisma/seed/data/roles.json`);
  });
  afterAll(async () => {
    await prisma.$executeRaw('TRUNCATE "User" CASCADE');
  });
  it('should register a new user', async () => {
    const originalUserCount = await prisma.user.count();
    const originalProvidersCount = await prisma.provider.count();
    const originalRoleCount = await prisma.role.count();

    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const password = faker.internet.password();
    const registrationDetails = {
      firstName,
      lastName,
      email,
      password,
    } as UserRegisterInput;

    const result = await registration.register(registrationDetails);

    const usersCount = await prisma.user.count();
    const providersCount = await prisma.provider.count();
    const userInRoleCount = await prisma.role.count({
      where: {
        users: {
          some: {
            email: {
              equals: email,
            },
          },
        },
      },
    });

    expect((result as UserDetailsWithRoles).id).toEqual(anyString());
    expect((result as ErrorResponse).error).toEqual(undefined);
    expect(usersCount).toEqual(originalUserCount + 1);
    expect(providersCount).toEqual(originalProvidersCount + 1);
  });
});
