import pactum from 'pactum';
import request from 'supertest';
import config from '../_common/config';

describe('app-controller', () => {
  let spec;
  beforeEach(() => {
    spec = pactum.spec();
  });
  it('on request', () => {
    request(config.baseUrl)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.body.version).toEqual(process.env.npm_package_version);
      });
  });
});
