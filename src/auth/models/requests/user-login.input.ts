import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
