import { getDataBaseDetails } from '../config-utils';

const { database, host, port, type, databaseUrl } = getDataBaseDetails();

export default () => ({
  env: {
    version: process.env.npm_package_version,
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
  },
  logging: {
    level: process.env.LOG_LEVEL,
    autoLogging: process.env.AUTO_LOGGING,
    seqServerUrl: process.env.SEQ_SERVER_URL,
    seqApiKey: process.env.SEQ_API_KEY,
  },
  database: {
    host,
    port,
    database,
    databaseUrl,
    type,
  },
});
