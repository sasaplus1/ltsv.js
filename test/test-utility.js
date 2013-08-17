var expect = require('expect.js'),
    utility = require('../lib/utility');

describe('utility', function() {

  describe('#getTypeName()', function() {

    it('should return typeof value', function() {
      expect(utility.getTypeName(1)).to.be('number');
      expect(utility.getTypeName('a')).to.be('string');
      expect(utility.getTypeName(true)).to.be('boolean');
      expect(utility.getTypeName(undefined)).to.be('undefined');
      expect(utility.getTypeName(function() {})).to.be('function');
      expect(utility.getTypeName({})).to.be('object');
    });

    it('should return "null" if parameter is null', function() {
      expect(utility.getTypeName(null)).to.be('null');
    });

  });

});
