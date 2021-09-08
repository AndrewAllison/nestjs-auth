import dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});

const config = {
  baseUrl: process.env.BASE_URL,
  authUrl: process.env.AUTH_URL,
  devEmail: process.env.DEV_EMAIL,
  devPassword: process.env.DEV_PASSWORD,
  integration: {
    databaseUrl: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  },
};

//
// JWT_SECRET=67y8efhnw8y34uie9hqwu8ryf7r9gyhe
// JWT_EXPIRES_IN=8h
// JWT_AUDIENCE=nestjs-auth
// JWT_ISSUER=https://nestjs-auth.org

export default config;
