// https://github.com/rMarinf/nest-cucumber/blob/master/test/acceptance/step-definitions/hello-world.steps.ts
import { before, binding, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { anyString } from 'jest-mock-extended';
import request from 'supertest';
import * as packageJson from '../../../package.json';

// tslint:disable-next-line:max-classes-per-file
@binding([])
export class ServerInfoSteps {
  request;

  @before()
  public async before(): Promise<void> {}

  @when(/Call to/)
  public async callToAPI() {
    this.request = request(process.env.BASE_URL).get('/');
  }

  @then('the response status code should be {int}')
  public statusResponse(status: number) {
    this.request.expect(status);
  }

  @then(/the response should contain the server version number/)
  public dataResponse() {
    this.request.then((response) => {
      expect(response.body).toEqual({
        version: packageJson.version,
        env: 'local',
        ip: '::ffff:127.0.0.1',
        date: anyString(),
      });
    });
  }
}
