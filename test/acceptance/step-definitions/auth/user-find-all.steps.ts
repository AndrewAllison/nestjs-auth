import { before, binding, then } from 'cucumber-tsflow';
import { given, when } from 'cucumber-tsflow/dist';
import request from 'supertest';
import config from '../../../_common/config';
// import { getAuthToken } from '../../../_common/get-auth.token';

@binding([])
export class ServerInfoSteps {
  request;
  token;

  @before()
  public async before(): Promise<void> {}

  @given(/that I'am unauthenticated/)
  public async iamUnathorized() {
    // I'm not authed.
    this.token = null;
  }

  @given(/that I am authenticated/)
  public async iamAuthorized() {
    // this.token = await getAuthToken(config.devEmail, config.devPassword);
  }

  @when(/I make a call to 'users'/)
  public async authorisedCallToEnrolments() {
    this.request = request(config.baseUrl)
      .get('/users')
      .set('Authorization', `Bearer ${this.token}`);
  }

  @then('the status code should be {int}')
  public statusResponse(status: number) {
    this.request.expect(status);
  }
}
