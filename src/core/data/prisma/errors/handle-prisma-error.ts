import { Prisma } from '@prisma/client';
import { ERROR_CODES } from '../../../../auth/consts/auth-error-codes.consts';
import { RelationsShipErrorMeta } from './relations-ship-error-meta';

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
    case 'P2014':
      const relationShipError = meta as RelationsShipErrorMeta;
      return {
        code: ERROR_CODES.DATABASE_RELATIONSHIP_CONSTRAINTS,
        message: `The change you are trying to make would violate the required relation '${relationShipError.relation_name}' between the ${relationShipError.model_a_name} and ${relationShipError.model_b_name} models.`,
      };
    default:
      return {
        code: ERROR_CODES.UNKNOWN,
        message: 'Unknown error occured',
      };
  }
};

export { mapError };
