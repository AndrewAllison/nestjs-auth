import * as faker from 'faker';
import { USER_STATUSES } from '../../../src/auth/consts';
import { UserCreateInput } from '../../../src/auth/models/requests/user-create.input';
// import { UserCreateRequest } from '../../src/auth/models/requests/user-create.input';
import {
  countUsers,
  createUser,
  deleteAllUsers,
} from '../../_common/user-functions';

const main = async () => {
  const create = new Promise(async (resolve, reject) => {
    const id = faker.datatype.uuid();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const createDetails = {
      id,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName),
    } as UserCreateInput;
    const result = await deleteAllUsers();

    await createUser(createDetails);

    if (!result.success) {
      return reject({ success: false, error: result.error });
    }

    return resolve({ result });
  });

  const userCount = countUsers({
    status: USER_STATUSES.ACTIVE,
  });
  return Promise.all([create, userCount]);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then((r) => {
    console.log('COMPLETED');
    console.log(r[0]);
    console.log(`USER-COUNT ${r[1]}`);
    process.exit(0);
  });
