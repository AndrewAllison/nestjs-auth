import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRegisterInput } from './user-register.input';

/**
 * Extends the RegisterNewUserInput class to add additonal properties for users to be created with roles and a given id
 * @extends {UserRegisterInput} RegisterNewUserInput
 */
export class UserCreateInput {
  @ApiProperty({
    example: '123-5678-9876',
  })
  @IsNotEmpty()
  id: string;

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
    example: 'The Chosen One',
  })
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    example: 'hp1@hogwartz.edu.org',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
