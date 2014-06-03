var expect = this.expect || require('expect.js'),
    parser = this.ltsv || require('../');

describe('parser', function() {

  describe('#parse()', function() {

    it('should return array', function() {
      expect(parser.parse('l1:v1\tl2:v2')).to.eql([
        { l1: 'v1', l2: 'v2' }
      ]);

      expect(parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);

      expect(parser.parse('l1:v1\tl2:v2\r\nl3:v3\tl4:v4\r\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

    it('should return array if value not found', function() {
      expect(parser.parse('label:')).to.eql([
        { label: '' }
      ]);

      expect(parser.parseStrict('label:\x0A')).to.eql([
        { label: '' }
      ]);

      expect(parser.parseStrict('label:\x0D\x0A')).to.eql([
        { label: '' }
      ]);
    });

    it('should return array if field has any separator', function() {
      expect(parser.parse('label:v:a:l:u:e')).to.eql([
        { label: 'v:a:l:u:e' }
      ]);
    });

    it('should return array if label has unexpected character', function() {
      expect(parser.parse('\x00\x2C:')).to.eql([
        { '\x00\x2C': '' }
      ]);

      expect(parser.parse('\x2F:')).to.eql([
        { '\x2F': '' }
      ]);

      // \x3A is ":"
      expect(parser.parse('\x3B\x40:')).to.eql([
        { '\x3B\x40': '' }
      ]);

      expect(parser.parse('\x5B\x5E:')).to.eql([
        { '\x5B\x5E': '' }
      ]);

      expect(parser.parse('\x60:')).to.eql([
        { '\x60': '' }
      ]);

      expect(parser.parse('\x7B\xFF:')).to.eql([
        { '\x7B\xFF': '' }
      ]);
    });

    it('should return array if value has unexpected character', function() {
      expect(parser.parse('label:\x00')).to.eql([
        { label: '\x00' }
      ]);

      expect(parser.parse('label:\x0D')).to.eql([
        { label: '\x0D' }
      ]);
    });

    it('shuold throw error if next field not found', function() {
      expect(function() {
        // \x09 is "\t"
        parser.parse('label:\x09');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

    it('should throw error if field not has separator', function() {
      expect(function() {
        parser.parse('label');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });
  });

  describe('#parseLine()', function() {

    it('should return object', function() {
      expect(parser.parseLine('label1:value1\tlabel2:value2')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });

      expect(parser.parseLine('label1:value1\tlabel2:value2\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });

      expect(parser.parseLine('label1:value1\tlabel2:value2\r\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });
    });

    it('should return object if value not found', function() {
      expect(parser.parseLine('label:')).to.eql({
        label: ''
      });

      expect(parser.parseLine('label:\x0A')).to.eql({
        label: ''
      });

      expect(parser.parseLine('label:\x0D\x0A')).to.eql({
        label: ''
      });
    });

    it('should return object if field has any separator', function() {
      expect(parser.parseLine('label:v:a:l:u:e')).to.eql({
        label: 'v:a:l:u:e'
      });
    });

    it('should return object if label has unexpected character', function() {
      expect(parser.parseLine('\x00\x2C:')).to.eql({
        '\x00\x2C': ''
      });

      expect(parser.parseLine('\x2F:')).to.eql({
        '\x2F': ''
      });

      // \x3A is ":"
      expect(parser.parseLine('\x3B\x40:')).to.eql({
        '\x3B\x40': ''
      });

      expect(parser.parseLine('\x5B\x5E:')).to.eql({
        '\x5B\x5E': ''
      });

      expect(parser.parseLine('\x60:')).to.eql({
        '\x60': ''
      });

      expect(parser.parseLine('\x7B\xFF:')).to.eql({
        '\x7B\xFF': ''
      });
    });

    it('should return object if value has unexpected character', function() {
      expect(parser.parseLine('label:\x00')).to.eql({
        label: '\x00'
      });

      expect(parser.parseLine('label:\x0D')).to.eql({
        label: '\x0D'
      });
    });

    it('should throw error if next field not found', function() {
      expect(function() {
        // \x09 is "\t"
        parser.parseLine('label:\x09');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

    it('should throw error if field not has separator', function() {
      expect(function() {
        parser.parseLine('label');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

  });

  describe('#parseStrict()', function() {

    it('should return array', function() {
      expect(parser.parseStrict('l1:v1\tl2:v2')).to.eql([
        { l1: 'v1', l2: 'v2' }
      ]);

      expect(parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);

      expect(parser.parseStrict('l1:v1\tl2:v2\r\nl3:v3\tl4:v4\r\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

    it('should return array if value not found', function() {
      expect(parser.parseStrict('label:')).to.eql([
        { label: '' }
      ]);

      expect(parser.parseStrict('label:\x0A')).to.eql([
        { label: '' }
      ]);

      expect(parser.parseStrict('label:\x0D\x0A')).to.eql([
        { label: '' }
      ]);
    });

    it('should return array if field has any separator', function() {
      expect(parser.parseStrict('label:v:a:l:u:e')).to.eql([
        { label: 'v:a:l:u:e' }
      ]);
    });

    it('should throw error if label has unexpected character', function() {
      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(function() {
        parser.parseStrict('\x00\x2C:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseStrict('\x2F:');
      }).to.throwError(fn);

      expect(function() {
        // \x3A is ":"
        parser.parseStrict('\x3B\x40:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseStrict('\x5B\x5E:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseStrict('\x60:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseStrict('\x7B\xFF:');
      }).to.throwError(fn);
    });

    it('should throw error if value has unexpected character', function() {
      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(function() {
        parser.parseStrict('label:\x00');
      }).to.throwError(fn);

      expect(function() {
        parser.parseStrict('label:\x0D');
      }).to.throwError(fn);
    });

    it('should throw error if next field not found', function() {
      expect(function() {
        // \x09 is "\t"
        parser.parseStrict('label:\x09');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

    it('should throw error if field not has separator', function() {
      expect(function() {
        parser.parseStrict('label');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

  });

  describe('#parseLineStrict()', function() {

    it('should return object', function() {
      expect(parser.parseLineStrict('label1:value1\tlabel2:value2')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });

      expect(parser.parseLineStrict('label1:value1\tlabel2:value2\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });

      expect(
          parser.parseLineStrict('label1:value1\tlabel2:value2\r\n')
      ).to.eql({
        label1: 'value1',
        label2: 'value2'
      });
    });

    it('should return object if value not found', function() {
      expect(parser.parseLineStrict('label:')).to.eql({
        label: ''
      });

      expect(parser.parseLineStrict('label:\x0A')).to.eql({
        label: ''
      });

      expect(parser.parseLineStrict('label:\x0D\x0A')).to.eql({
        label: ''
      });
    });

    it('should return object if field has any separator', function() {
      expect(parser.parseLineStrict('label:v:a:l:u:e')).to.eql({
        label: 'v:a:l:u:e'
      });
    });

    it('should throw error if label has unexpected character', function() {
      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(function() {
        parser.parseLineStrict('\x00\x2C:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseLineStrict('\x2F');
      }).to.throwError(fn);

      expect(function() {
        // \x3A is ":"
        parser.parseLineStrict('\x3B\x40:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseLineStrict('\x5B\x5E:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseLineStrict('\x60:');
      }).to.throwError(fn);

      expect(function() {
        parser.parseLineStrict('\x7B\xFF:');
      }).to.throwError(fn);
    });

    it('should throw error if value has unexpected character', function() {
      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(function() {
        parser.parseLineStrict('label:\x00');
      }).to.throwError(fn);

      expect(function() {
        parser.parseLineStrict('label:\x09');
      }).to.throwError(fn);

      expect(function() {
        parser.parseLineStrict('label:\x0D');
      }).to.throwError(fn);
    });

    it('should throw error if next field not found', function() {
      expect(function() {
        // \x09 is "\t"
        parser.parseLine('label:\x09');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

    it('should throw error if field not has separator', function() {
      expect(function() {
        parser.parseLineStrict('label');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

  });

});
