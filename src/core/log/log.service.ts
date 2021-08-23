import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LogService extends PinoLogger {
  constructor(name) {
    super(name);
  }
  log(message, ...optionalParams) {
    this.info(message, optionalParams);
  }
}
