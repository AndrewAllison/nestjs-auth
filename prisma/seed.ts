import dotenv from 'dotenv';
import { RoleService } from '../src/auth/services/role.service';
import { PrismaService } from '../src/core/data/prisma/prisma.service';
import { getPinoLogger } from '../src/core/log/log-utils';
import { LogService } from '../src/core/log/log.service';
import { importRoles } from './seed/roles.seed';

dotenv.config({
  path: `./.env.${process.env.NODE_ENV || 'local'}`,
});

const service = new PrismaService();
// const passwordService = new PasswordService();
const logger = getPinoLogger('seed-data') as LogService;

// const userService = new UserService(logger, service, passwordService);
const roleService = new RoleService(service, logger);

const main = async () => {
  logger.info('[SEED-DATA] Starting seed');
  // const permissionImportResult = await importPermissions(
  //   permissionService,
  //   logger,
  // );
  const roleImportResult = await importRoles(roleService, logger);
  // const userImportResult = await importUsers(userService, logger);
  const result = {
    // permissions: { ...permissionImportResult },
    roles: { ...roleImportResult },
    // users: { ...userImportResult },
  };
  logger.info(result, `[SEED-DATA] Completed`);
  console.log(`[SEED-DATA] Completed`, result);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await service.$disconnect();
  });
