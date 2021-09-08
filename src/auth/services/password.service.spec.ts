import { Test, TestingModule } from '@nestjs/testing';
import { mockCryptoService } from '../../__testing__/mocks/crypto-service.mock';
import { mockLogService } from '../../__testing__/mocks/log-service.mock';
import { mockPrismaService } from '../../__testing__/mocks/prisma-service.mock';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { LogService } from '../../core/log/log.service';
import { CryptoService } from './crypto.service';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LogService,
          useValue: mockLogService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
