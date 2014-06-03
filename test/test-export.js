var expect = this.expect || require('expect.js'),
    ltsv = this.ltsv || require('../');

describe('export', function() {

  it('should exports some functions', function() {
    expect(ltsv).to.have.keys([
      'format',
      'formatStrict',
      'parse',
      'parseLine',
      'parseStrict',
      'parseLineStrict'
    ]);
    if (typeof process !== 'undefined' && typeof require !== 'undefined') {
      expect(ltsv).to.have.key('createLtsvToJsonStream');
    }
  });

});
