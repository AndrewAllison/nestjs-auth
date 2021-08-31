import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserInputBase {
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
}
