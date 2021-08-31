import { Prisma } from '@prisma/client';
import { ERROR_CODES } from '../../../auth/consts/auth-error-codes.consts';

const mapError = (
  error: Prisma.PrismaClientKnownRequestError,
  entity: string,
) => {
  const { meta } = error;
  const details = meta as any;
  switch (error.code) {
    case 'P2002':
      return {
        code: ERROR_CODES.ALREADY_EXISTS,
        message: `Conflict: A ${entity} with that ${details.target} already exists`,
      };
    case 'P2003':
      return {
        code: ERROR_CODES.FOREIGN_CONSTRAINTS,
        message: `Conflict: Issue with foreign key ${details.field_name}`,
      };
    default:
      return {
        code: ERROR_CODES.UNKNOWN,
        message: 'Unknown error occured',
      };
  }
};

export { mapError };
