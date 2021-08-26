import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { RegisterUserInput } from './register-user.input';

/**
 * Extends the RegisterNewUserInput class to add additonal properties for users to be created with roles and a given id
 * @extends {RegisterUserInput} RegisterNewUserInput
 */
export class UserCreateInput extends RegisterUserInput {
  @ApiProperty({
    nullable: true,
    example: 'The Chosen One',
  })
  displayName: string;

  @ApiProperty({
    nullable: true,
    example: '123-5678-9876',
  })
  id?: string;

  @ApiProperty({
    example: 'emailAndPassword',
  })
  @IsIn(['emailAndPassword', 'facebook'])
  roles?: string[];
}
