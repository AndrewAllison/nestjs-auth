import { Body, Controller, HttpStatus, Post, Version } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRegistrationInput } from '../models/requests/create-registration.input';
import { UserProfileDto } from '../models/dtos/user-profile.dto';
import { RegistrationService } from '../services/registration.service';

/**
 * Controller dealing with user related functions such as registration
 */
@ApiTags('User')
@Controller('user')
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
  @Post('register')
  public async register(
    @Body() registrationDetails: UserRegistrationInput,
  ): Promise<UserProfileDto> {
    return this.userService.register(registrationDetails);
  }
}
