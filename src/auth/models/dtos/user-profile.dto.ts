import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    example: '1232-454-345',
    description: 'Unique identifier for the user',
  })
  public id: string;
  @ApiProperty({
    example: 'Harry',
    description: 'First name for the user',
  })
  public firstName: string;
  @ApiProperty({
    example: 'Potter',
    description: 'Last name for the user',
  })
  public lastName: string;
  @ApiProperty({
    example: 'The Chosen ONe',
    description: 'Display Name of the user',
  })
  public displayName: string;
  @ApiProperty({
    example: 'hp1@hogwartz.edu.org',
    description: 'First name for the user',
  })
  public email: string;
  @ApiProperty({
    example: ['User'],
    description: 'First name for the user',
  })
  public roles: string[];
}
