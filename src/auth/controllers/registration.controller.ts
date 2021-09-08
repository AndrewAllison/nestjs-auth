import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '../../core/models/error-response.model';
import { UserRegisterInput } from '../models/requests/user-register.input';
import { UserDetailsWithRoles } from '../models/user';
import { RegistrationService } from '../services/registration.service';

/**
 * Controller dealing with user related functions such as registration
 */
@ApiTags('Registration')
@Controller('register')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Registration method for creating new users within the system.
   * @param registrationDetails
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Creates a new user from the registration details',
  })
  @HttpCode(200)
  @Version('1')
  @Post('user')
  public async register(
    @Body() registrationDetails: UserRegisterInput,
  ): Promise<UserDetailsWithRoles | ErrorResponse> {
    const result = await this.registrationService.register(registrationDetails);
    if (result instanceof ErrorResponse)
      throw new BadRequestException(result.error);
    return result;
  }
}
