import { LOGIN_SETTINGS, USER_STATUSES } from '../consts';
import { UserWithLoginDetails } from '../models/user';

const checkUserCanTryLogin = (existingUser: UserWithLoginDetails): boolean => {
  return (
    existingUser.failedLogins.length < LOGIN_SETTINGS.MAX_ATTEMPS &&
    existingUser.status === USER_STATUSES.ACTIVE
  );
};

export { checkUserCanTryLogin };
