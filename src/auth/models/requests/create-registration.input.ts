import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class UserRegistrationInput {
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

export class CreateRegistrationInput extends UserRegistrationInput {
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
