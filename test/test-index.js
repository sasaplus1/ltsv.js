var expect, ltsv;

if (typeof module !== 'undefined') {
  expect = require('expect.js');
  ltsv = require('../');
} else {
  expect = this.expect;
  ltsv = this.ltsv;
}

describe('index', function() {

  var isNode = (typeof module !== 'undefined');

  it('should export some functions for node.js', (isNode) ? function() {
    expect(ltsv).to.have.keys([
      'parse',
      'parseLine',
      'parseStrict',
      'parseLineStrict',
      'format',
      'formatStrict',
      'createLtsvToJsonStream'
    ]);
  } : void 0);

  it('should export some functions for browser', (!isNode) ? function() {
    expect(ltsv).to.have.keys([
      'parse',
      'parseLine',
      'parseStrict',
      'parseLineStrict',
      'format',
      'formatStrict'
    ]);
  } : void 0);

});
