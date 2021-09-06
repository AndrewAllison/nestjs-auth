import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../src/core/data/prisma/prisma.service';

const importRoles = async (prisma: PrismaService, path: string) => {
  const filePath = join(__dirname, path);
  const seedRoles = JSON.parse(readFileSync(filePath, 'utf-8'));

  for (let i = 0; i < seedRoles.length; i++) {
    await prisma.role.upsert({
      create: {
        name: seedRoles[i].name,
        description: seedRoles[i].description,
      },
      update: {
        name: seedRoles[i].name,
        description: seedRoles[i].description,
        modifiedAt: new Date(),
      },
      where: {
        name: seedRoles[i].name,
      },
    });
  }
};

export { importRoles };
