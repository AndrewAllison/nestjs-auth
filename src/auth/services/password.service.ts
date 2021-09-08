import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LogService } from '../../core/log/log.service';
import { AUTH_PROVIDERS } from '../consts/provider.types';
import { CryptoService } from './crypto.service';

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly logger: LogService,
  ) {
    this.logger.setContext(PasswordService.name);
  }

  async setUserPassword(email: string, password: string) {
    const existingUser = await this.findUser(email);

    if (!existingUser) {
      throw Error('User not found');
    }

    const existingProvider = await this.findPasswordProvider(existingUser);

    const { hash, salt } = this.crypto.createPasswordHash(password);

    try {
      await this.prisma.$transaction([
        this.prisma.user.update({
          data: {
            password: hash,
            modifiedAt: new Date(),
          },
          where: {
            email,
          },
        }),
        this.prisma.provider.upsert({
          create: {
            userId: existingUser.id,
            email,
            token: salt,
            provider: AUTH_PROVIDERS.EMAIL,
          },
          update: {
            token: salt,
            modifiedAt: new Date(),
          },
          where: {
            id: existingProvider?.id || uuid(),
          },
        }),
      ]);

      return { success: true, payload: {} };
    } catch (e) {
      this.logger.error({ stack: e, action: 'reset-password' });
      return { success: false, error: e };
    }
  }

  async validate(email: string, password: string) {
    const existingUser = await this.findUser(email);
    const existingProvider = await this.findPasswordProvider(existingUser);

    if (existingUser && existingProvider) {
      return this.crypto.validatePassword(
        password,
        existingUser.password,
        existingProvider.token,
      );
    }
    return false;
  }

  private async findPasswordProvider(existingUser) {
    const existingProvider = await existingUser.providers.filter(
      (p) => p.provider === AUTH_PROVIDERS.EMAIL,
    )[0];
    return existingProvider;
  }

  private async findUser(email: string) {
    return this.prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        password: true,
        providers: true,
        _count: {
          select: {
            failedLogins: true,
          },
        },
      },
      where: {
        email,
      },
    });
  }
}
