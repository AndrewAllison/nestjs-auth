import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../src/auth/services/crypto.service';
import { PasswordService } from '../../src/auth/services/password.service';
import { UserService } from '../../src/auth/services/user.service';
import { PrismaService } from '../../src/core/data/prisma/prisma.service';
import { getPinoLogger } from '../../src/core/log/log-utils';
import { LogService } from '../../src/core/log/log.service';

const jwtService = new JwtService({
  secret: 'JustA$ecr£t',
});
const crypto = new CryptoService(jwtService);
const prisma = new PrismaService();
const userService = new UserService(prisma);
const logger = new LogService(getPinoLogger('testing'));
const passwordService = new PasswordService(prisma, crypto, logger);

const main = async () => {
  // we have an existing user that either has no password or wants to reset an existing password

  const userId = '01becfc4-efa3-471c-b4dd-69bf96fd93bf';
  const newPassword = 'I^mAwi££ard';

  const email = 'hp1@hogwarts.edu.org';
  const newUser = await userService.create({
    id: userId,
    firstName: 'Harry',
    lastName: 'Potter',
    email: email,
    displayName: 'The Chose Oone',
  });

  await passwordService.setUserPassword(email, newPassword);

  if (!(await passwordService.validate(email, newPassword))) {
    throw new Error('Password failed.');
  }

  const deleteHim = await userService.delete([userId]);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then((r) => {
    console.log('COMPLETED');
    process.exit(0);
  });
