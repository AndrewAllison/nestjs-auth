import { AUTH_PROVIDERS } from '../../consts/provider.types';
import { ProviderCreateInput } from '../../models/requests/provider-create.input';
import { createProviderDetails, determineRolestoAdd } from './user.functions';

describe('user-functions', () => {
  describe('createProviderDetails', () => {
    it('should default to emailAndPassword if the origin is not present', () => {
      const providerDetails: ProviderCreateInput = {
        email: 'hp1@hogwartz.edu.org',
        token: '2348790876342',
      };
      const result = createProviderDetails(providerDetails);
      expect(result.provider).toEqual(AUTH_PROVIDERS.EMAIL);
    });
  });

  describe('determineRolestoAdd', () => {
    it('should return connector array', () => {
      const roles = ['User', 'Admin'];
      const expectedResult = [{ name: 'User' }, { name: 'Admin' }];
      const result = determineRolestoAdd(roles);
      expect(result).toEqual(expectedResult);
    });
    it('should return default user array if roles is empty', () => {
      const roles = [];
      const expectedResult = [{ name: 'User' }];
      const result = determineRolestoAdd(roles);
      expect(result).toEqual(expectedResult);
    });
    it('should return default user array if roles is undefined', () => {
      const roles = undefined;
      const expectedResult = [{ name: 'User' }];
      const result = determineRolestoAdd(roles);
      expect(result).toEqual(expectedResult);
    });
  });
});
