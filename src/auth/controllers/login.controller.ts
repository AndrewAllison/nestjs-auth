import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { ErrorResponse } from '../../core/models/error-response.model';
import { Public } from '../decorators/public.decorator';
import { UserLoginInput } from '../models/requests/user-login.input';
import { LoginService } from '../services/login.service';
import { AuthCode } from '../models/auth-code';

@ApiTags('Auth')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @HttpCode(200)
  @HttpCode(401)
  @Post('/authorize')
  async authorize(
    @Body() req: UserLoginInput,
    @RealIP() ip: string,
  ): Promise<AuthCode | ErrorResponse> {
    const { email, password } = req;

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
      throw new UnauthorizedException({
        error: (loginAttempt as ErrorResponse).error,
      });
  }

  @Public()
  @HttpCode(200)
  @HttpCode(401)
  @Post('/token')
  async token(@Body() req: AuthCode, @RealIP() ip: string): Promise<any> {
    const { code, uic } = req;
    const result = await this.loginService.exchangeCodeForToken(uic, code, ip);
    if (result instanceof ErrorResponse)
      throw new UnauthorizedException(result.error);
    return result;
  }
}
