import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
// import { randomBytes } from 'crypto';

/**
 * Service for dealing with passwords and some general crypto functions relating to authentication
 */
@Injectable()
export class PasswordService {
  /**
   * Creates a hash and salt from a password
   * @param password {string} the password to hash
   */
  createPasswordHash = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(`${password}${salt}`, salt);
    return { salt, hash };
  };
  /**
   * Validates a password against the given parameters
   * @param password {string} The password to be validated
   * @param hashedPassword The hased version of the password stored usually in the database
   * @param salt The salt used by the hashing algorythem
   * @return {boolean} true if valid else false
   */
  validatePassword = (
    password: string,
    hashedPassword: string,
    salt: string,
  ) => {
    return bcrypt.compareSync(`${password}${salt}`, hashedPassword);
  };
  /**
   * Generates a set of random bytes to specified length
   * @param size {number} indicates the size of the bytes to be used in the generation
   */
  createRandomCode(size: number) {
    return randomBytes(size).toString('hex');
  }

  /**
   * Creates a random set of digits to be used in things like MFA and validations
   * @param digits {number} The amount of digits that will be produced
   */
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
