import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAttempt, Prisma, User } from '@prisma/client';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { ErrorResponse } from '../../core/models/error-response.model';
import { ERROR_CODES } from '../consts/auth-error-codes.consts';
import { AuthCode } from '../models/auth-code';
import { checkUserCanTryLogin } from '../functions';
import { LoginAttemptInput } from '../models/requests/login-attempt.input';
import { CryptoService } from './crypto.service';
import { PasswordService } from './password.service';
import { UserMapper } from './user-mapper.service';

export const createErrorResponse = (code, message) =>
  ({
    error: {
      code,
      message,
    },
  } as ErrorResponse);

export const buildQueryLoginAttemptsByUserId = (userId: any) => ({
  where: {
    userId: {
      equals: userId,
    },
    status: {
      equals: 'pending',
    },
    expiresAt: {
      gt: new Date(),
    },
  },
  orderBy: {
    createdAt: 'desc',
  } as Prisma.LoginAttemptOrderByWithRelationInput,
  include: {
    user: true,
  },
});

@Injectable()
export class LoginService {
  constructor(
    private readonly crypto: CryptoService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  attemptLogin = async (
    loginDetails: LoginAttemptInput,
    ip = '127.0.0.1',
  ): Promise<AuthCode | ErrorResponse> => {
    const { email, password } = loginDetails;
    const existingUser = await this.getUserByEmailWithLoginsAndProviders(email);

    if (!checkUserCanTryLogin(existingUser)) {
      // there where too many failed attempts
      return createErrorResponse(
        ERROR_CODES.AUTH_LOCKED,
        'There were too many login attempts or the account is locked.',
      );
    }

    const isValidPassword = await this.passwordService.validate(
      email,
      password,
    );
    if (!isValidPassword) {
      return createErrorResponse(
        ERROR_CODES.INVALID_PASSWORD,
        'The password or email does not match any in our system.',
      );
    }

    try {
      const code = this.crypto.createRandomCode(32);
      const { hash, salt } = this.crypto.createPasswordHash(code);

      await this.prisma.loginAttempt.create({
        data: {
          id: uuid(),
          code: hash,
          exchange: salt,
          ip,
          expiresAt: DateTime.now().plus({ days: 1 }).toJSDate(),
          user: {
            connect: {
              email: email ? email.toLowerCase() : undefined,
            },
          },
        },
      });

      return {
        code,
        uic: existingUser.id,
      };
    } catch (e) {
      return createErrorResponse(ERROR_CODES.LOGIN_FAILED, e.message);
    }
  };

  exchangeCodeForToken = async (uic, code, ip = '127.0.0.1') => {
    const validUser = await this.validateLoginAttempt({ code, userId: uic });
    if (validUser instanceof ErrorResponse)
      throw new UnauthorizedException(validUser.error);

    await this.cleanUpLoginAttempts(uic, ip);

    return this.crypto.prepareToken(validUser);
  };

  validateLoginAttempt = async (params: {
    code: any;
    userId: any;
  }): Promise<User | ErrorResponse> => {
    const { userId, code } = params;
    const getLoginAttemptsQuery = buildQueryLoginAttemptsByUserId(userId);

    const loginAttempts = await this.prisma.loginAttempt.findMany(
      getLoginAttemptsQuery,
    );

    if (loginAttempts.length > 0) {
      const codeMatches = this.crypto.validatePassword(
        code,
        loginAttempts[0].code,
        loginAttempts[0].exchange,
      );

      if (codeMatches) return loginAttempts[0].user;
    }
    return createErrorResponse(
      ERROR_CODES.AUTH_EXCHANGE_FAILED,
      'Code exchane failed, there is possibly an invalid or expired auth code.',
    );
  };

  private async cleanUpLoginAttempts(uic, ip: string) {
    const createLoginSuccess = this.prisma.loginSuccess.create({
      data: {
        userId: uic,
        ip,
      },
    });
    // delete the existing attempts
    const deleteAttempts = this.prisma.loginAttempt.updateMany({
      data: {
        modifiedAt: new Date(),
        status: 'success',
      },
      where: {
        userId: {
          in: [uic],
        },
      },
    });

    await this.prisma.$transaction([createLoginSuccess, deleteAttempts]);
  }

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
