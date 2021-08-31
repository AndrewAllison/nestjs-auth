import { readFileSync } from 'fs';
import { PinoLogger } from 'nestjs-pino';
import path from 'path';
import { RoleService } from '../../src/auth/services/role.service';

const seedRoles = async (roleService: RoleService, logger, roles) => {
  const results = {
    created: 0,
    failed: 0,
    updated: 0,
  };
  const total = await roleService.count();
  logger.info(
    {
      seed: 'roles',
      existingCount: total,
      toSeedCount: roles.length,
    },
    `[SEED-DATA:roles] Starting seed data`,
  );
  for (let i = 0; i < roles.length; i += 1) {
    const role = { ...roles[i] };

    try {
      const existingRole = await roleService.findByName(role.name);

      if (existingRole) {
        // edit
        // const newPermissions = role.permissions.map((p) => ({
        //   name: p,
        // }));
        // const newUsers = (role.users || []).map((u) => ({
        //   id: u.id,
        // }));
        // const users = determineConnections(newUsers, existingRole?.User || []);
        // const permissions = determineConnections(
        //   newPermissions,
        //   existingRole,
        //   'name',
        // );
        const updateDetails = Object.assign(existingRole, role);
        // updateDetails.permissions = permissions;
        // updateDetails.users = users;
        const result = await roleService.update(updateDetails);
        if (!result.success) {
          logger.error(
            {
              seed: 'role',
              error: result.error,
            },
            `[SEED-DATA:ROLES] Failed to create role ${role.name}: Error ${
              result.error.code || 'UNKNOWN'
            }: ${result.error.message}`,
          );
          results.failed += 1;
        } else {
          results.updated += 1;
        }
      } else {
        // role.permissions = {
        //   connect: roles[i].permissions.map((p) => ({ name: p })),
        // };
        const result = await roleService.create(role);
        if (!result.success) {
          logger.error(
            {
              seed: 'role',
              error: result.error,
            },
            `[SEED-DATA:ROLES] Failed to create role ${role.name}: Error ${
              result.error.code || 'UNKNOWN'
            }: ${result.error.message}`,
          );
          results.failed += 1;
        } else {
          results.created += 1;
        }
      }
    } catch (e) {
      logger.error(
        { error: e, seed: 'roles', permissionId: role.id },
        `[SEED-DATA:ROLES] Failed to create permission ${role.name}`,
      );
      results.failed += 1;
    }
  }
  logger.info(
    {
      seed: 'roles',
      seedCount: roles.length,
      seedResults: results,
    },
    `[SEED-DATA:ROLES] Completed`,
  );

  return results;
};

const importRoles = async (roleService: RoleService, logger: PinoLogger) => {
  const filePath = path.join(__dirname, `./data/roles.json`);
  console.log(`FilePath: ${filePath}`);
  const readData = JSON.parse(readFileSync(filePath, 'utf-8'));
  const result = await seedRoles(roleService, logger, readData);
  console.log(`Seed-User Complete ${JSON.stringify(result)}`);
  return result;
};

export { importRoles };
