import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../core/data/prisma/prisma.service';
import { UserRegisterInput } from './models/user-register.input';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordHelper: PasswordService,
  ) {}

  public async register({
    id = uuid(),
    displayName,
    firstName,
    lastName,
    email,
    password,
    origin,
    roles,
  }: UserRegisterInput) {
    const createWithDetails = {
      id: id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: '',
      displayName: displayName || `${firstName.trim()} ${lastName.trim()}`,
      roles: { connect: this.determineRolestoAdd(roles) },
      providers: { create: [] },
    };

    // If we have a user from a social provider there will be no password.
    if (password) {
      const passwordHashResult =
        this.passwordHelper.createPasswordHash(password);
      createWithDetails.password = passwordHashResult.hash;
      createWithDetails.providers.create.push({
        email: email.trim().toLowerCase(),
        token: passwordHashResult.salt,
        provider: 'emailAndPassword',
      });
    } else {
      createWithDetails.providers.create.push({
        id: uuid(),
        email: email.trim().toLowerCase(),
        provider: origin.trim(),
      });
    }

    return await this.prisma.user.create({
      data: createWithDetails,
    });
  }

  private determineRolestoAdd(roles: string[]) {
    const rolesToAdd = [];
    if (roles) {
      roles.forEach((r) => (r ? rolesToAdd.push({ name: r }) : ''));
    } else {
      rolesToAdd.push({ name: 'User' });
    }
    return rolesToAdd;
  }
}
