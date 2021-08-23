import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/data/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
}
