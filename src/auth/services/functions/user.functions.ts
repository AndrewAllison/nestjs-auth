import { AUTH_PROVIDERS } from '../../consts/provider.types';
import { ProviderCreateInput } from '../../models/requests/provider-create.input';
import { DEFAULT_ROLES } from '../registration.service';

const createProviderDetails = ({
  email,
  origin = AUTH_PROVIDERS.EMAIL,
  token,
}: ProviderCreateInput) => {
  const providerDetails = {
    email: email.trim().toLowerCase(),
    token: token,
    provider: origin,
  };

  return providerDetails;
};

const determineRolestoAdd = (roles: string[]) => {
  const hasValidRoles = (roles) => {
    return roles && roles.length > 0;
  };
  return (hasValidRoles(roles) ? roles : DEFAULT_ROLES).reduce(
    (previouse, current) => {
      previouse.push({ name: current });
      return previouse;
    },
    [],
  );
};

export { createProviderDetails, determineRolestoAdd };
