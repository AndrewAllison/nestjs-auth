import { Test, TestingModule } from '@nestjs/testing';
import { mockLogService } from '../../__testing__/mocks/log-service.mock';
import { mockPrismaService } from '../../__testing__/mocks/prisma-service.mock';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LogService } from '../../core/log/log.service';
import { RoleService } from './role.service';

describe('RolesService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LogService,
          useValue: mockLogService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
