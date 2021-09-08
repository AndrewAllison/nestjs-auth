import { getDataBaseDetails } from '../config-utils';

const { database, host, port, type, databaseUrl } = getDataBaseDetails();

export default () => ({
  database: {
    host,
    port,
    database,
    databaseUrl,
    type,
  },
  env: {
    version: process.env.npm_package_version,
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  },
  logging: {
    level: process.env.LOG_LEVEL,
    autoLogging: process.env.AUTO_LOGGING,
    seqServerUrl: process.env.SEQ_SERVER_URL,
    seqApiKey: process.env.SEQ_API_KEY,
  },
});
