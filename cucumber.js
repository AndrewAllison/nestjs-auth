let common = [
  'test/acceptance/features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require test/acceptance/step-definitions/**/*.ts', // Load step definitions
  '--format progress-bar', // Load custom formatter
  '--publish', // public the features
].join(' ');

module.exports = {
  default: common,
};
