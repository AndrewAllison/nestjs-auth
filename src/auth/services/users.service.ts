import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/data/prisma/prisma.service';
import { UserProfileDto } from '../models/dtos/user-profile.dto';
import { UserMapper } from './user-mapper.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserProfileDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => UserMapper.toDto(u));
  }
}
