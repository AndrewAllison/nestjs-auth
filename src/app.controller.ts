import { Controller, Get, HttpStatus } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';

@Controller()
export class AppController {
  @Get('')
  getInfo(@RealIP() ip: string) {
    return {
      version: process.env.npm_package_version,
      env: process.env.NODE_ENV,
      ip,
      date: new Date().toISOString(),
    };
  }

  @Get('/favicon.ico')
  getFavIcon() {
    return HttpStatus.OK;
  }
}
