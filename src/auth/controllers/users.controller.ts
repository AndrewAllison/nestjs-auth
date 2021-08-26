import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileDto } from '../models/dtos/user-profile.dto';
import { UsersService } from '../services/users.service';

@Controller('items')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<UserProfileDto[]> {
    return this.userService.findAll();
  }
}
