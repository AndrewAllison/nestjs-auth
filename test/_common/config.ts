import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({
    path: '.env.test',
    debug: true,
  });
} else {
  dotenv.config();
}

const config = {
  baseUrl: process.env.BASE_URL,
  authUrl: process.env.AUTH_URL,
  devEmail: process.env.DEV_EMAIL,
  devPassword: process.env.DEV_PASSWORD,
};

export default config;
