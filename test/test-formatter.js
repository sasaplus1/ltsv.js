var expect = require('expect.js'),
    formatter = require('../lib/formatter');

describe('formatter', function() {

  describe('#format()', function() {

    it('should generate LTSV from object', function() {
      expect(
          formatter.format({
            label1: 'value1',
            label2: 'value2'
          })
      ).to.be('label1:value1\tlabel2:value2');
    });

    it('should generate LTSV from object in array', function() {
      expect(
          formatter.format([
            { l1: 'v1', l2: 'v2' },
            { l3: 'v3', l4: 'v4' }
          ])
      ).to.be('l1:v1\tl2:v2\nl3:v3\tl4:v4');
    });

    it('should throw error if parameter is not an object or array', function() {
      function f(v) {
        return function() {
          formatter.format(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f(1)).to.throwError(fn);
      expect(f('a')).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(undefined)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

  });

  describe('#formatStrict()', function() {

    it('should generate LTSV from object', function() {
      expect(
          formatter.formatStrict({
            label1: 'value1',
            label2: 'value2'
          })
      ).to.be('label1:value1\tlabel2:value2');
    });

    it('should generate LTSV from object in array', function() {
      expect(
          formatter.formatStrict([
            { l1: 'v1', l2: 'v2' },
            { l3: 'v3', l4: 'v4' }
          ])
      ).to.be('l1:v1\tl2:v2\nl3:v3\tl4:v4');
    });

    it('should throw error if parameter is not an object or array', function() {
      function f(v) {
        return function() {
          formatter.formatStrict(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f(1)).to.throwError(fn);
      expect(f('a')).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(undefined)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

  });

  describe('#objectToRecord_()', function() {

    it('should generate record from object', function() {
      expect(
          formatter.objectToRecord_({
            label1: 'value1',
            label2: 'value2'
          })
      ).to.be('label1:value1\tlabel2:value2');
    });

    it('should generate record if label has unexpected character', function() {
      expect(
          formatter.objectToRecord_({
            '\x00\x2C': ''
          })
      ).to.be('\x00\x2C:');

      expect(
          formatter.objectToRecord_({
            '\x2F': ''
          })
      ).to.be('\x2F:');

      // \x3A is ":"
      expect(
          formatter.objectToRecord_({
            '\x3B\x40': ''
          })
      ).to.be('\x3B\x40:');

      expect(
          formatter.objectToRecord_({
            '\x5B\x5E': ''
          })
      ).to.be('\x5B\x5E:');

      expect(
          formatter.objectToRecord_({
            '\x60': ''
          })
      ).to.be('\x60:');

      expect(
          formatter.objectToRecord_({
            '\x7B\xFF': ''
          })
      ).to.be('\x7B\xFF:');
    });

    it('should generate record if value has unexpected character', function() {
      expect(
          formatter.objectToRecord_({
            label: '\x00\x09\x0A\x0D'
          })
      ).to.be('label:\x00\x09\x0A\x0D');
    });

    it('should throw error if parameter is not an object', function() {
      function f(v) {
        return function() {
          formatter.objectToRecord_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f(1)).to.throwError(fn);
      expect(f('a')).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(undefined)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

  });

  describe('#objectToRecordStrict_()', function() {

    it('should generate record from object', function() {
      expect(
          formatter.objectToRecordStrict_({
            label1: 'value1',
            label2: 'value2'
          })
      ).to.be('label1:value1\tlabel2:value2');
    });

    it('should throw error if parameter is not an object', function() {
      function f(v) {
        return function() {
          formatter.objectToRecordStrict_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f(1)).to.throwError(fn);
      expect(f('a')).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(undefined)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

    it('should throw error if label has unexpected character', function() {
      function f(v) {
        return function() {
          formatter.objectToRecordStrict_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(f({ '\x00\x2C': '' })).to.throwError(fn);
      expect(f({ '\x2F': '' })).to.throwError(fn);
      expect(f({ '\x3B\x40': '' })).to.throwError(fn);
      expect(f({ '\x5B\x5E': '' })).to.throwError(fn);
      expect(f({ '\x60': '' })).to.throwError(fn);
      expect(f({ '\x7B\xFF': '' })).to.throwError(fn);
    });

    it('should throw error if value has unexpected character', function() {
      function f(v) {
        return function() {
          formatter.objectToRecordStrict_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(f({ label: '\x00' })).to.throwError(fn);
      expect(f({ label: '\x09' })).to.throwError(fn);
      expect(f({ label: '\x0A' })).to.throwError(fn);
      expect(f({ label: '\x0D' })).to.throwError(fn);
    });

  });

});
