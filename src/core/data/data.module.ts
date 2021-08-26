import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Mapper } from './mapper.service';

@Module({
  providers: [PrismaService, Mapper],
  exports: [PrismaService],
})
export class DataModule {}
