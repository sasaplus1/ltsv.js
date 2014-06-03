var expect = this.expect || require('expect.js'),
    utility = this.ltsv || require('../');

describe('utility', function() {

  describe('#getType()', function() {

    it('should return "null" if arg is null', function() {
      expect(utility.getType(null)).to.be('null');
    });

    it('should return "array" if paramter is Array', function() {
      expect(utility.getType([])).to.be('array');
    });

    it('should return typeof value', function() {
      expect(utility.getType(1)).to.be('number');
      expect(utility.getType('a')).to.be('string');
      expect(utility.getType(true)).to.be('boolean');
      expect(utility.getType(void 0)).to.be('undefined');
      expect(utility.getType(function() {})).to.be('function');
      expect(utility.getType({})).to.be('object');
    });

  });

  describe('#getObjectKeys()', function() {

    it('should throw error if arg is not an Object', function() {
      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(function() {
        utility.getObjectKeys(1);
      }).to.throwError(fn);

      expect(function() {
        utility.getObjectKeys('a');
      }).to.throwError(fn);

      expect(function() {
        utility.getObjectKeys(true);
      }).to.throwError(fn);

      expect(function() {
        utility.getObjectKeys(null);
      }).to.throwError(fn);

      expect(function() {
        utility.getObjectKeys(void 0);
      }).to.throwError(fn);
    });

    it('should return array of keys in arg', function() {
      var fn = function() {};

      fn.one = 1;
      fn.two = 2;
      fn.three = 3;

      expect(utility.getObjectKeys(fn)).to.eql([
        'one', 'two', 'three'
      ]);

      expect(utility.getObjectKeys([
        'a', 'b', 'c'
      ])).to.eql([
        '0', '1', '2'
      ]);

      expect(utility.getObjectKeys({
        i: 1, ro: 'ro', ha: true
      })).to.eql([
        'i', 'ro', 'ha'
      ]);
    });

  });

  describe('#isArray()', function() {

    it('should return true if arg is an array', function() {
      expect(utility.isArray([])).to.be(true);
    });

    it('should return false if arg is not an array', function() {
      expect(utility.isArray(1)).to.be(false);
      expect(utility.isArray('a')).to.be(false);
      expect(utility.isArray(true)).to.be(false);
      expect(utility.isArray(null)).to.be(false);
      expect(utility.isArray(void 0)).to.be(false);
      expect(utility.isArray(function() {})).to.be(false);
      expect(utility.isArray({})).to.be(false);
    });

  });

});
