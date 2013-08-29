var expect, ltsv;

if (typeof module !== 'undefined') {
  expect = require('expect.js');
  ltsv = require('../');
} else {
  expect = this.expect;
  ltsv = this.ltsv;
}

describe('index', function() {

  it('should not export extra functions', function() {
    var isNode = (typeof module !== 'undefined');

    expect(ltsv).to.have.keys([
      'parse',
      'parseLine',
      'parseStrict',
      'parseLineStrict',
      'format',
      'formatStrict'
    ]);

    if (isNode) {
      expect(ltsv).to.have.key('createLtsvToJsonStream');
    }
  });

});
