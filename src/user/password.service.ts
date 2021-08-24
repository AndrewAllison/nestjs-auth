import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
// import { randomBytes } from 'crypto';

@Injectable()
export class PasswordService {
  createPasswordHash = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(`${password}${salt}`, salt);
    return { salt, hash };
  };
  validatePassword = (
    password: string,
    hashedPassword: string,
    salt: string,
  ) => {
    return bcrypt.compareSync(`${password}${salt}`, hashedPassword);
  };
  /**
   * Generates a set of random bytes to specified length
   * @param size
   */
  createRandomCode(size: number) {
    return randomBytes(size).toString('hex');
  }
  createRandomDigits(digits: number) {
    const add = 1;
    // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
    let max = 12 - add;
    if (digits > max) {
      return (
        this.createRandomDigits(max) + this.createRandomDigits(digits - max)
      );
    }

    max = Math.pow(10, digits + add);
    const min = max / 10; // Math.pow(10, digits) basically
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ('' + number).substring(add);
  }
}
