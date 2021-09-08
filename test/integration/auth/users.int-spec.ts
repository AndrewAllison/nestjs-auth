import { User } from '@prisma/client';
import { USER_STATUSES } from '../../../src/auth/consts';
import { ERROR_CODES } from '../../../src/auth/consts/auth-error-codes.consts';
import { UserService } from '../../../src/auth/services/user.service';
import { PrismaService } from '../../../src/core/data/prisma/prisma.service';
import { ErrorResponse } from '../../../src/core/models/error-response.model';
import config from '../../_common/config';
import { createUsers } from '../../_common/user-functions';

describe('user-service', () => {
  let userService: UserService;
  let prisma: PrismaService;
  beforeAll(async () => {
    if (config.integration.databaseUrl.indexOf('auth-test') <= 0) {
      throw new Error('Do not run integrations on databases other that test');
    }
    prisma = new PrismaService();
    await prisma.$executeRaw('TRUNCATE "User" CASCADE');
    userService = new UserService(prisma);
  });
  describe('count', () => {
    beforeAll(async () => {
      await prisma.$executeRaw('TRUNCATE "User" CASCADE');
    });
    afterAll(async () => {
      await prisma.$executeRaw('TRUNCATE "User" CASCADE');
    });
    it('should return a count of the total users in the system', async () => {
      expect(await userService.count()).toEqual(0);
    });
    it('should return a count based on a where clause', async () => {
      await createUsers(userService, prisma, 10, 2);

      expect(await userService.count()).toEqual(10);
      expect(
        await userService.count({
          status: 'disabled',
        }),
      ).toEqual(2);
    });
  });
  describe('findMany', () => {
    beforeAll(async () => {
      await prisma.$executeRaw('TRUNCATE "User" CASCADE');
    });
    afterAll(async () => {
      await prisma.$executeRaw('TRUNCATE "User" CASCADE');
    });
    it('should return all the users', async () => {
      await createUsers(userService, prisma, 100, 20);

      const results = await userService.findMany({
        status: USER_STATUSES.DISABLED,
      });

      expect(results.length).toEqual(20);
    });
    it('should return all the users', async () => {
      await createUsers(userService, prisma, 100);

      const results = await userService.findMany();

      expect(results.length).toEqual(100);
    });
  });
  describe('create', () => {
    it('should create a user', async () => {
      const originalCount = await userService.count();
      const createdUser = await userService.create({
        id: '1234-5678-9',
        displayName: 'Hermione Grainger',
        firstName: 'Hermione',
        lastName: 'Grainger',
        email: 'hg1@hogwarts.edu.org',
      });
      expect((createdUser as User).id).toEqual('1234-5678-9');
      expect((createdUser as User).createdAt).not.toBeNull();
      expect(await userService.count()).toEqual(originalCount + 1);
    });
    it('should return an error if the user exists', async () => {
      const originalCount = await userService.count();
      const createdUser = await userService.create({
        id: '1234-5678-9',
        displayName: 'Hermione Grainger',
        firstName: 'Hermione',
        lastName: 'Grainger',
        email: 'hg1@hogwarts.edu.org',
      });
      expect((createdUser as ErrorResponse).error.code).toEqual(
        ERROR_CODES.ALREADY_EXISTS,
      );
      expect(await userService.count()).toEqual(originalCount);
    });
  });
  describe('delete', () => {
    it('should delete the identified users', async () => {
      const originalCount = await userService.count();
      const createdUser = (await userService.create({
        id: '666',
        displayName: 'Ron',
        firstName: 'Ronald',
        lastName: 'Weasley',
        email: 'rw1@hogwarts.edu.org',
      })) as User;
      expect(await userService.count()).toEqual(originalCount + 1);
      await userService.delete([createdUser.id]);
      expect(await userService.count()).toEqual(originalCount);
    });
  });
});
