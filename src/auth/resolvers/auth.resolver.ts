import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { TokenResponse } from 'src/graphql';
import { ErrorResponse } from '../../core/models/error-response.model';
import { UserIp } from '../decorators/ip.decorator';
import { Public } from '../decorators/public.decorator';
import { LoginService } from '../services/login.service';
import { RegistrationService } from '../services/registration.service';

@InputType()
export class AuthoriseInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class TokenRequest {
  @Field()
  code: string;
  @Field()
  uic: string;
}

@InputType()
export class RegisterUserInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly loginService: LoginService,
    private readonly registrationService: RegistrationService,
  ) {}

  @Public()
  @Mutation()
  async authorize(
    @Args('authorizeData') authorizeData: AuthoriseInput,
    @UserIp() ip: string,
  ) {
    const { email, password } = authorizeData;
    const loginAttempt = await this.loginService.attemptLogin(
      {
        email,
        password,
      },
      ip,
    );
    if (!(loginAttempt instanceof ErrorResponse) && loginAttempt.code)
      return loginAttempt;
    else
      throw new UnauthorizedException(
        (loginAttempt as ErrorResponse).error.message,
      );
  }

  @Public()
  @Mutation()
  async token(
    @Args('tokenRequest') tokenRequest: TokenRequest,
    @UserIp() ip: string,
  ): Promise<TokenResponse> {
    const { uic, code } = tokenRequest;
    const result = await this.loginService.exchangeCodeForToken(uic, code, ip);
    if (!(result instanceof ErrorResponse) && result.accessToken) return result;
    else
      throw new UnauthorizedException((result as ErrorResponse).error.message);
  }

  @Public()
  @Mutation()
  async register(
    @Args('registrationData') registrationData: RegisterUserInput,
  ) {
    const result = await this.registrationService.register(registrationData);
    if (!(result instanceof ErrorResponse) && result.id)
      return this.loginService.createLoginAttempt(result);
    else throw new BadRequestException((result as ErrorResponse).error.message);
  }
}
