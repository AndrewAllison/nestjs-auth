const getDataBaseDetails = () => {
  const databaseUrl = process.env.DATABASE_URL;
  const type = databaseUrl.split(':')[0];
  const host = databaseUrl.split(':')[2].split('@')[1];
  const port = databaseUrl.split(':')[3].split('/')[0];
  const database = databaseUrl.split(':')[3].split('/')[1].split('?')[0];
  return { database, databaseUrl, host, port, type };
};

export { getDataBaseDetails };
