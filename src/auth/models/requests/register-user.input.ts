import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Contains the properties required to register a new user via public end points
 */
export class RegisterUserInput {
  @ApiProperty({
    example: 'Harry',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Potter',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'hp1@hogwartz.edu.org',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '%^DTYCGV&(*UUITf6ty',
    description:
      'Passwords are only required when you are not doing a SocialMedia login',
  })
  @IsNotEmpty()
  password?: string;
}
