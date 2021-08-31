import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LogService } from '../../core/log/log.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LogService,
  ) {}

  count = async (where = {}): Promise<number> => {
    return await this.prisma.role.count({
      where: where,
    });
  };

  create = async (details) => {
    const id = details.id ? details.id : uuid();
    try {
      const result = await this.prisma.role.create({
        data: {
          id,
          name: details.name,
          description: details.description,
          // User: details.users,
          // Permission: details.permissions,
        },
      });
      return { success: true, payload: result };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  update = async (details) => {
    try {
      this.logger.debug(
        { action: 'updated', entity: 'role', id: details.id },
        `[ROLE:UPDATE]`,
      );
      const result = await this.prisma.role.update({
        data: {
          name: details.name,
          description: details.description,
          // User: details.users,
          // Permission: details.permissions,
          modifiedAt: new Date(),
        },
        where: {
          id: details.id,
        },
      });
      return { success: true, payload: result };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  delete = async (ids: string[]) => {
    this.logger.debug(
      { action: 'delete', entity: 'role', ids },
      `[ROLE:DELETE]`,
    );
    const results = await this.prisma.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return results.count;
  };

  findByName = async (name) => {
    return this.prisma.role.findUnique({
      where: {
        name: name,
      },
    });
  };

  findMany = async (name) => {
    return this.prisma.role.findMany();
  };
}
