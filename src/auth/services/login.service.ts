import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { checkUserCanTryLogin } from '../functions';

export class LoginAttemptInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaService) {}

  attemptLogin = async (loginDetails: LoginAttemptInput, ip = '127.0.0.1') => {
    const { email } = loginDetails;
    const existingUser = await this.getUserByEmailWithLoginsAndProviders(email);

    if (checkUserCanTryLogin(existingUser)) {
      // there where too many failed attempts
    }

    // check the users has not exceeded their login attempts already
    // check the user exists and is active
    // validate the password against the one stored in the database
    // store the login attempt
    // generate a code and a payload to send back to the user
  };

  private async getUserByEmailWithLoginsAndProviders(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        providers: true,
        failedLogins: true,
      },
    });
    return existingUser;
  }
}
