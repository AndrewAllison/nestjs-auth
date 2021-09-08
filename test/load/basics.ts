/// https://www.npmjs.com/package/loadtest
import loadtest from 'loadtest';
import config from '../_common/config';

function statusCallback(
  error: Error,
  result: any,
  latency: loadtest.LoadTestResult,
) {
  console.log(
    'Current latency %j, result %j, error %j',
    latency,
    result,
    error,
  );
  console.log('----');
  console.log('Request elapsed milliseconds: ', result.requestElapsed);
  console.log('Request index: ', result.requestIndex);
  console.log('Request loadtest() instance index: ', result.instanceIndex);
}

const options: loadtest.LoadTestOptions = {
  url: config.baseUrl,
  maxRequests: 10,
  requestsPerSecond: 5,
  statusCallback: statusCallback,
};

loadtest.loadTest(options, (error) => {
  if (error) {
    return console.error('Got an error: %s', error);
  }
  console.log('Tests run successfully');
});
