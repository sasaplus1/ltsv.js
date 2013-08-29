var expect, parser;

if (typeof module !== 'undefined') {
  expect = require('expect.js'),
  parser = require('../').parser_;
} else {
  expect = this.expect;
  parser = this.ltsv.parser_;
}

describe('parser', function() {

  describe('#parse()', function() {

    it('should split to records', function() {
      expect(parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

    it('should split to fields with ignore LF or CRLF', function() {
      expect(parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);

      expect(parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4\r\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

  });

  describe('#parseLine()', function() {

    it('should split to fields', function() {
      expect(parser.parseLine('label1:value1\tlabel2:value2')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });
    });

    it('should split to fields with ignore LF or CRLF', function() {
      expect(parser.parseLine('label1:value1\tlabel2:value2\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });

      expect(parser.parseLine('label1:value1\tlabel2:value2\r\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });
    });

  });

  describe('#parseStrict()', function() {

    it('should split to records', function() {
      expect(parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

    it('should split to fields with ignore LF or CRLF', function() {
      expect(parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);

      expect(parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4\r\n')).to.eql([
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

  });

  describe('#parseLineStrict()', function() {

    it('should split to fields', function() {
      expect(parser.parseLineStrict('label1:value1\tlabel2:value2')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });
    });

    it('should split to fields with ignore LF or CRLF', function() {
      expect(parser.parseLineStrict('label1:value1\tlabel2:value2\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });

      expect(parser.parseLineStrict('label1:value1\tlabel2:value2\r\n')).to.eql({
        label1: 'value1',
        label2: 'value2'
      });
    });

  });

  describe('#splitField_()', function() {

    it('should split to label and value', function() {
      expect(parser.splitField_('label:value')).to.eql({
        label: 'label',
        value: 'value'
      });
    });

    it('should split field if field has any separator', function() {
      expect(parser.splitField_('label:v:a:l:u:e')).to.eql({
        label: 'label',
        value: 'v:a:l:u:e'
      });
    });

    it('should split field if label has unexpected character', function() {
      expect(parser.splitField_('\x00\x2C:')).to.eql({
        label: '\x00\x2C',
        value: ''
      });

      expect(parser.splitField_('\x2F:')).to.eql({
        label: '\x2F',
        value: ''
      });

      // \x3A is ":"
      expect(parser.splitField_('\x3B\x40:')).to.eql({
        label: '\x3B\x40',
        value: ''
      });

      expect(parser.splitField_('\x5B\x5E:')).to.eql({
        label: '\x5B\x5E',
        value: ''
      });

      expect(parser.splitField_('\x60:')).to.eql({
        label: '\x60',
        value: ''
      });

      expect(parser.splitField_('\x7B\xFF:')).to.eql({
        label: '\x7B\xFF',
        value: ''
      });
    });

    it('should split field if value has unexpected character', function() {
      expect(parser.splitField_('label:\x00')).to.eql({
        label: 'label',
        value: '\x00'
      });

      expect(parser.splitField_('label:\x09')).to.eql({
        label: 'label',
        value: '\x09'
      });

      expect(parser.splitField_('label:\x0A')).to.eql({
        label: 'label',
        value: '\x0A'
      });

      expect(parser.splitField_('label:\x00')).to.eql({
        label: 'label',
        value: '\x00'
      });
    });

    it('should throw error if field not has separator', function() {
      expect(function() {
        parser.splitField_('label');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

  });

  describe('#splitFieldStrict_()', function() {

    it('should split to label and value', function() {
      expect(parser.splitFieldStrict_('label:value')).to.eql({
        label: 'label',
        value: 'value'
      });
    });

    it('should split field if field has any separator', function() {
      expect(parser.splitFieldStrict_('label:v:a:l:u:e')).to.eql({
        label: 'label',
        value: 'v:a:l:u:e'
      });
    });

    it('should throw error if label has unexpected character', function() {
      function f(v) {
        return function() {
          parser.splitFieldStrict_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(f('\x00\x2C:')).to.throwError(fn);
      expect(f('\x2F:')).to.throwError(fn);
      // \x3A is ":"
      expect(f('\x3B\x40:')).to.throwError(fn);
      expect(f('\x5B\x5E:')).to.throwError(fn);
      expect(f('\x60:')).to.throwError(fn);
      expect(f('\x7B\xFF:')).to.throwError(fn);
    });

    it('should throw error if value has unexpected character', function() {
      function f(v) {
        return function() {
          parser.splitFieldStrict_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(SyntaxError);
      }

      expect(f('label:\x00')).to.throwError(fn);
      expect(f('label:\x09')).to.throwError(fn);
      expect(f('label:\x0A')).to.throwError(fn);
      expect(f('label:\x0D')).to.throwError(fn);
    });

    it('should throw error if field not has separator', function() {
      expect(function() {
        parser.splitFieldStrict_('label');
      }).to.throwError(function(e) {
        expect(e).to.be.a(SyntaxError);
      });
    });

  });

});
