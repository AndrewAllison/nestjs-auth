import request from 'supertest';
import config from './config';

export async function getAuthToken(email: string, password: string) {
  const codeResponse = await request(config.authUrl).post('/auth/login').send({
    email,
    password,
  });
  const { code, uic } = codeResponse.body;
  const tokenResponse = request(config.authUrl).post('/auth/token').send({
    code: code,
    uic: uic,
  });
  return (tokenResponse as any).accessToken;
}
