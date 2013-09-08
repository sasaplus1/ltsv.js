var expect, util;

if (typeof module !== 'undefined') {
  expect = require('expect.js');
  util = require('../').util_;
} else {
  expect = this.expect;
  util = this.ltsv.util_;
}

describe('util', function() {

  describe('#isArray_()', function() {

    it('should return true if parameter is an array', function() {
      expect(util.isArray([])).to.be(true);
    });

    it('should return false if parameter is not an array', function() {
      expect(util.isArray(1)).to.be(false);
      expect(util.isArray('a')).to.be(false);
      expect(util.isArray(true)).to.be(false);
      expect(util.isArray(null)).to.be(false);
      expect(util.isArray(void 0)).to.be(false);
      expect(util.isArray(function() {})).to.be(false);
      expect(util.isArray({})).to.be(false);
    });

  });

});
