import pactum from 'pactum';
import request from 'supertest';

describe('app-controller', () => {
  let spec;
  beforeEach(() => {
    spec = pactum.spec();
  });
  it('on request', () => {
    request(process.env.BASE_URL)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.body.version).toEqual(process.env.npm_package_version);
      });
  });
});
