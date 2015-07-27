// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    'test-recorder-spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],


  capabilities: {'browserName': 'chrome'},

  baseUrl: 'http://localhost:' + ( '8081'),

  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true
  },

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
