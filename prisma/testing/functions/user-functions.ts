import { USER_STATUSES } from '../../../src/auth/consts';
import { UserService } from '../../../src/auth/services/user.service';
import { PrismaService } from '../../../src/core/data/prisma/prisma.service';

const prisma = new PrismaService();
const userService = new UserService(prisma);

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

export { deleteAllUsers, createUser, countUsers };
