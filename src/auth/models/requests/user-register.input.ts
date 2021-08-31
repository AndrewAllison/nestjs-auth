import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInputBase } from './user-input.base';

/**
 * Contains the properties required to register a new user via public end points
 */
export class UserRegisterInput extends UserInputBase {
  @ApiProperty({
    example: '%^DTYCGV&(*UUITf6ty',
    description:
      'Passwords are only required when you are not doing a SocialMedia login',
  })
  @IsNotEmpty()
  password?: string;
}
