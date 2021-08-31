import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { mapError } from '../../core/data/prisma/handle-prisma-error';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { ERROR_CODES } from '../consts/auth-error-codes.consts';
import { UserCreateInput } from '../models/requests/user-create.input';
import { UserDetailsWithRoles } from '../models/user';
import { USER_SELECT_BASIC } from '../querires';
import { UserMapper } from './user-mapper.service';

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async count(where: Prisma.UserWhereInput = {}): Promise<number> {
    return this.prisma.user.count({
      where,
    });
  }

  async findMany(
    where: Prisma.UserWhereInput = {},
  ): Promise<UserDetailsWithRoles[]> {
    const users = await this.prisma.user.findMany({
      select: { ...USER_SELECT_BASIC, roles: true },
      where,
    });
    return users.map((u) => UserMapper.flattern(u));
  }

  /**
   * Creates a new user record with the given detils.
   * @param createDetails {UserCreateInput} The cerate object with the user details
   * @returns {Promise<User>} a Promise with the given user object
   */
  async create(createDetails: UserCreateInput): Promise<User | ErrorResponse> {
    try {
      return await this.prisma.user.create({
        data: {
          ...createDetails,
          id: createDetails.id,
          displayName:
            createDetails.displayName ||
            `${createDetails.firstName} ${createDetails.lastName}`,
        },
        select: USER_SELECT_BASIC,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return { error: mapError(e, 'User') } as ErrorResponse;
      }
      return {
        error: { code: ERROR_CODES.UNKNOWN, message: e.message },
      } as ErrorResponse;
    }
  }

  /**
   * Delets's the given users along with their providers.
   * @param userIds A string array of the ids that will be deleted
   * @example ['1234-56556-345345', 'ytw221-d33d12d41-d21321']
   * @returns {{ success: boolean; error?: any; payload?: string[] }} Returns a sucess of failure object
   */
  async delete(
    userIds: string[],
  ): Promise<{ success: boolean; error?: any; payload?: unknown }> {
    try {
      const result = await this.prisma.$transaction([
        this.prisma.provider.deleteMany({
          where: {
            userId: {
              in: userIds,
            },
          },
        }),
        this.prisma.user.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        }),
      ]);
      return { success: true, payload: result[1] };
    } catch (e) {
      return { success: false, error: e };
    }
  }
}
