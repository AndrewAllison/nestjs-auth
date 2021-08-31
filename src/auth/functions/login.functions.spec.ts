import { USER_STATUSES } from '../consts';
import { UserWithLoginDetails } from '../models/user';
import { checkUserCanTryLogin } from './login.functions';

describe('login-functions', () => {
  describe('checkAttemptsAndStatus', () => {
    it('should return true when no failed attempts and teh user is active', () => {
      const validUser = {
        failedLogins: [],
        status: USER_STATUSES.ACTIVE,
      };

      const result = checkUserCanTryLogin(validUser as UserWithLoginDetails);

      expect(result).toEqual(true);
    });
  });
});
