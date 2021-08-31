import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRegisterInput } from '../models/requests/user-register.input';
import { UserDetailsWithRoles } from '../models/user';
import { RegistrationService } from '../services/registration.service';

export class RegisterResponse {
  success: boolean;
  payload?: UserDetailsWithRoles;
  error?: any;
}

/**
 * Controller dealing with user related functions such as registration
 */
@ApiTags('Registration')
@Controller('register')
export class RegistrationController {
  constructor(private readonly userService: RegistrationService) {}

  /**
   * Registration method for creating new users within the system.
   * @param registrationDetails
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Creates a new user from the registration details',
  })
  @Version('1')
  @Post('user')
  public async register(
    @Body() registrationDetails: UserRegisterInput,
  ): Promise<RegisterResponse | { error: any }> {
    const result = await this.userService.register(registrationDetails);
    if (!result.error) {
      return result;
    }
    throw new BadRequestException(result.error);
  }
}
