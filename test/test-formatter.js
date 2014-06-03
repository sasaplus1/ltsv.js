var expect = this.expect || require('expect.js'),
    formatter = this.ltsv || require('../');

describe('formatter', function() {

  describe('#format()', function() {

    it('should generate LTSV string from object', function() {
      expect(formatter.format({
        label1: 'value1',
        label2: 'value2'
      })).to.be('label1:value1\tlabel2:value2');
    });

    it('should generate LTSV string from object in array', function() {
      expect(formatter.format([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ])).to.be('l1:v1\tl2:v2\nl3:v3\tl4:v4');
    });

    it('should throw error if arg is not an object or array', function() {
      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(function() {
        formatter.format(1);
      }).to.throwError(fn);

      expect(function() {
        formatter.format('a');
      }).to.throwError(fn);

      expect(function() {
        formatter.format(true);
      }).to.throwError(fn);

      expect(function() {
        formatter.format(null);
      }).to.throwError(fn);

      expect(function() {
        formatter.format(void 0);
      }).to.throwError(fn);

      expect(function() {
        formatter.format(function() {});
      }).to.throwError(fn);
    });

    it('should generate record if label has unexpected character', function() {
      expect(formatter.format({
        '\x00\x2C': ''
      })).to.be('\x00\x2C:');

      expect(formatter.format({
        '\x2F': ''
      })).to.be('\x2F:');

      // \x3A is ":"
      expect(formatter.format({
        '\x3B\x40': ''
      })).to.be('\x3B\x40:');

      expect(formatter.format({
        '\x5B\x5E': ''
      })).to.be('\x5B\x5E:');

      expect(formatter.format({
        '\x60': ''
      })).to.be('\x60:');

      expect(formatter.format({
        '\x7B\xFF': ''
      })).to.be('\x7B\xFF:');
    });

    it('should generate record if value has unexpected character', function() {
      expect(formatter.format({
        label: '\x00\x09\x0A\x0D'
      })).to.be('label:\x00\x09\x0A\x0D');
    });

  });

  describe('#formatStrict()', function() {

    it('should generate LTSV string from object', function() {
      expect(formatter.formatStrict({
        label1: 'value1',
        label2: 'value2'
      })).to.be('label1:value1\tlabel2:value2');
    });

    it('should generate LTSV string from object in array', function() {
      expect(formatter.formatStrict([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ])).to.be('l1:v1\tl2:v2\nl3:v3\tl4:v4');
    });

    it('should throw error if arg is not an object or array', function() {
      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(function() {
        formatter.formatStrict(1);
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict('a');
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict(true);
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict(null);
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict(void 0);
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict(function() {});
      }).to.throwError(fn);
    });

    it('should throw error if label has unexpected character', function() {
      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(function() {
        formatter.formatStrict({ '\x00\x2C': '' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ '\x2F': '' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ '\x3B\x40': '' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ '\x5B\x5E': '' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ '\x60': '' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ '\x7B\xFF': '' });
      }).to.throwError(fn);
    });

    it('should throw error if value has unexpected character', function() {
      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(function() {
        formatter.formatStrict({ label: '\x00' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ label: '\x09' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ label: '\x0A' });
      }).to.throwError(fn);

      expect(function() {
        formatter.formatStrict({ label: '\x0D' });
      }).to.throwError(fn);
    });

  });

});
