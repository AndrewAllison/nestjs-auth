import faker from 'faker';
import { USER_STATUSES } from '../../src/auth/consts';
import { UserService } from '../../src/auth/services/user.service';
import { PrismaService } from '../../src/core/data/prisma/prisma.service';

const prisma = new PrismaService();
const userService = new UserService(prisma);

async function createUsers(
  userService: UserService,
  prisma: PrismaService,
  userCount: number,
  disabledCount = 0,
) {
  for (let i = 0; i < userCount; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userId = `test-${i}`;
    await userService.create({
      id: userId,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName),
    });

    if (disabledCount && disabledCount > 0)
      if (i >= userCount - disabledCount) {
        await prisma.user.update({
          data: {
            status: 'disabled',
          },
          where: {
            id: userId,
          },
        });
      }
  }
}

async function deleteAllUsers() {
  const userIds = (
    await prisma.user.findMany({
      select: {
        id: true,
      },
    })
  ).map((u) => u.id);
  const result = await userService.delete(userIds);
  return result;
}

async function createUser(createDetails) {
  return await userService.create(createDetails);
}

async function countUsers(where = {}) {
  return await userService.count(where);
}

export { deleteAllUsers, createUser, createUsers, countUsers };
