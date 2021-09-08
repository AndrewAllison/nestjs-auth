import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from 'src/core/models/error-response.model';
import { ERROR_CODES } from '../consts/auth-error-codes.consts';

import { Public } from '../decorators/public.decorator';
import { UserCreateInput } from '../models/requests/user-create.input';
import { UserDetailsWithRoles } from '../models/user';
import { PasswordService } from '../services/password.service';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly password: PasswordService,
  ) {}

  @Get()
  async findAll(): Promise<UserDetailsWithRoles[]> {
    return this.userService.findMany();
  }

  @Public()
  @Post()
  async create(@Body() body: UserCreateInput) {
    const result = await this.userService.create(body);
    if ((result as ErrorResponse).error) {
      const { code, message } = (result as ErrorResponse).error;
      if (code === ERROR_CODES.ALREADY_EXISTS)
        throw new ConflictException({ code, message });
      throw new BadRequestException({ code, message });
    }
    return result;
  }

  @Public()
  @Delete()
  async delete(@Body() body: { userIds: string[] }) {
    const { userIds } = body;
    return this.userService.delete(userIds);
  }

  @Public()
  @Patch('set-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.password.setUserPassword(email, password);
  }
}
