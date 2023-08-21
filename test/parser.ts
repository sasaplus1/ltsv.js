import { strict as assert } from 'node:assert';

import { parse, parseLine, parseStrict, parseLineStrict } from '../src/parser';

describe('parser', function () {
  describe('#parse()', function () {
    it('should return array', function () {
      assert.deepStrictEqual(parse('l1:v1\tl2:v2'), [{ l1: 'v1', l2: 'v2' }]);
      assert.deepStrictEqual(parse('l1:v1\tl2:v2\nl3:v3\tl4:v4\n'), [
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
      assert.deepStrictEqual(parse('l1:v1\tl2:v2\r\nl3:v3\tl4:v4\r\n'), [
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

    it('should return array if value not found', function () {
      assert.deepStrictEqual(parse('label:'), [{ label: '' }]);
      assert.deepStrictEqual(parse('label:\x0A'), [{ label: '' }]);
      assert.deepStrictEqual(parse('label:\x0D\x0A'), [{ label: '' }]);
    });

    it('should return array if field has any separator', function () {
      assert.deepStrictEqual(parse('label:v:a:l:u:e'), [
        { label: 'v:a:l:u:e' }
      ]);
    });

    it('should return array if label has unasserted character', function () {
      assert.deepStrictEqual(parse('\x00\x2C:'), [{ '\x00\x2C': '' }]);
      assert.deepStrictEqual(parse('\x2F:'), [{ '\x2F': '' }]);
      // NOTE: \x3A is ":"
      assert.deepStrictEqual(parse('\x3B\x40:'), [{ '\x3B\x40': '' }]);
      assert.deepStrictEqual(parse('\x5B\x5E:'), [{ '\x5B\x5E': '' }]);
      assert.deepStrictEqual(parse('\x60:'), [{ '\x60': '' }]);
      assert.deepStrictEqual(parse('\x7B\xFF:'), [{ '\x7B\xFF': '' }]);
    });

    it('should return array if value has unasserted character', function () {
      assert.deepStrictEqual(parse('label:\x00'), [{ label: '\x00' }]);
      assert.deepStrictEqual(parse('label:\x0D'), [{ label: '\x0D' }]);
    });

    it('shuold throw error if next field not found', function () {
      assert.throws(function () {
        // NOTE: \x09 is "\t"
        parse('label:\x09');
      }, SyntaxError);
    });

    it('should throw error if field not has separator', function () {
      assert.throws(function () {
        parse('label');
      }, SyntaxError);
    });
  });

  describe('#parseLine()', function () {
    it('should return object', function () {
      assert.deepStrictEqual(parseLine('label1:value1\tlabel2:value2'), {
        label1: 'value1',
        label2: 'value2'
      });
      assert.deepStrictEqual(parseLine('label1:value1\tlabel2:value2\n'), {
        label1: 'value1',
        label2: 'value2'
      });
      assert.deepStrictEqual(parseLine('label1:value1\tlabel2:value2\r\n'), {
        label1: 'value1',
        label2: 'value2'
      });
    });

    it('should return object if value not found', function () {
      assert.deepStrictEqual(parseLine('label:'), {
        label: ''
      });
      assert.deepStrictEqual(parseLine('label:\x0A'), {
        label: ''
      });
      assert.deepStrictEqual(parseLine('label:\x0D\x0A'), {
        label: ''
      });
    });

    it('should return object if field has any separator', function () {
      assert.deepStrictEqual(parseLine('label:v:a:l:u:e'), {
        label: 'v:a:l:u:e'
      });
    });

    it('should return object if label has unasserted character', function () {
      assert.deepStrictEqual(parseLine('\x00\x2C:'), {
        '\x00\x2C': ''
      });
      assert.deepStrictEqual(parseLine('\x2F:'), {
        '\x2F': ''
      });
      // NOTE: \x3A is ":"
      assert.deepStrictEqual(parseLine('\x3B\x40:'), {
        '\x3B\x40': ''
      });
      assert.deepStrictEqual(parseLine('\x5B\x5E:'), {
        '\x5B\x5E': ''
      });
      assert.deepStrictEqual(parseLine('\x60:'), {
        '\x60': ''
      });
      assert.deepStrictEqual(parseLine('\x7B\xFF:'), {
        '\x7B\xFF': ''
      });
    });
    it('should return object if value has unasserted character', function () {
      assert.deepStrictEqual(parseLine('label:\x00'), {
        label: '\x00'
      });
      assert.deepStrictEqual(parseLine('label:\x0D'), {
        label: '\x0D'
      });
    });
    it('should throw error if next field not found', function () {
      assert.throws(function () {
        // NOTE: \x09 is "\t"
        parseLine('label:\x09');
      }, SyntaxError);
    });
    it('should throw error if field not has separator', function () {
      assert.throws(function () {
        parseLine('label');
      }, SyntaxError);
    });
  });

  describe('#parseStrict()', function () {
    it('should return array', function () {
      assert.deepStrictEqual(parseStrict('l1:v1\tl2:v2'), [
        { l1: 'v1', l2: 'v2' }
      ]);
      assert.deepStrictEqual(parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4\n'), [
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
      assert.deepStrictEqual(parseStrict('l1:v1\tl2:v2\r\nl3:v3\tl4:v4\r\n'), [
        { l1: 'v1', l2: 'v2' },
        { l3: 'v3', l4: 'v4' }
      ]);
    });

    it('should return array if value not found', function () {
      assert.deepStrictEqual(parseStrict('label:'), [{ label: '' }]);
      assert.deepStrictEqual(parseStrict('label:\x0A'), [{ label: '' }]);
      assert.deepStrictEqual(parseStrict('label:\x0D\x0A'), [{ label: '' }]);
    });

    it('should return array if field has any separator', function () {
      assert.deepStrictEqual(parseStrict('label:v:a:l:u:e'), [
        { label: 'v:a:l:u:e' }
      ]);
    });

    it('should throw error if label has unasserted character', function () {
      assert.throws(function () {
        parseStrict('\x00\x2C:');
      }, SyntaxError);
      assert.throws(function () {
        parseStrict('\x2F:');
      }, SyntaxError);
      assert.throws(function () {
        // NOTE: \x3A is ":"
        parseStrict('\x3B\x40:');
      }, SyntaxError);
      assert.throws(function () {
        parseStrict('\x5B\x5E:');
      }, SyntaxError);
      assert.throws(function () {
        parseStrict('\x60:');
      }, SyntaxError);
      assert.throws(function () {
        parseStrict('\x7B\xFF:');
      }, SyntaxError);
    });

    it('should throw error if value has unasserted character', function () {
      assert.throws(function () {
        parseStrict('label:\x00');
      }, SyntaxError);
      assert.throws(function () {
        parseStrict('label:\x0D');
      }, SyntaxError);
    });

    it('should throw error if next field not found', function () {
      assert.throws(function () {
        // NOTE: \x09 is "\t"
        parseStrict('label:\x09');
      }, SyntaxError);
    });

    it('should throw error if field not has separator', function () {
      assert.throws(function () {
        parseStrict('label');
      }, SyntaxError);
    });
  });

  describe('#parseLineStrict()', function () {
    it('should return object', function () {
      assert.deepStrictEqual(parseLineStrict('label1:value1\tlabel2:value2'), {
        label1: 'value1',
        label2: 'value2'
      });
      assert.deepStrictEqual(
        parseLineStrict('label1:value1\tlabel2:value2\n'),
        {
          label1: 'value1',
          label2: 'value2'
        }
      );
      assert.deepStrictEqual(
        parseLineStrict('label1:value1\tlabel2:value2\r\n'),
        {
          label1: 'value1',
          label2: 'value2'
        }
      );
    });

    it('should return object if value not found', function () {
      assert.deepStrictEqual(parseLineStrict('label:'), {
        label: ''
      });
      assert.deepStrictEqual(parseLineStrict('label:\x0A'), {
        label: ''
      });
      assert.deepStrictEqual(parseLineStrict('label:\x0D\x0A'), {
        label: ''
      });
    });

    it('should return object if field has any separator', function () {
      assert.deepStrictEqual(parseLineStrict('label:v:a:l:u:e'), {
        label: 'v:a:l:u:e'
      });
    });

    it('should throw error if label has unasserted character', function () {
      assert.throws(function () {
        parseLineStrict('\x00\x2C:');
      }, SyntaxError);
      assert.throws(function () {
        parseLineStrict('\x2F');
      }, SyntaxError);
      assert.throws(function () {
        // NOTE: \x3A is ":"
        parseLineStrict('\x3B\x40:');
      }, SyntaxError);
      assert.throws(function () {
        parseLineStrict('\x5B\x5E:');
      }, SyntaxError);
      assert.throws(function () {
        parseLineStrict('\x60:');
      }, SyntaxError);
      assert.throws(function () {
        parseLineStrict('\x7B\xFF:');
      }, SyntaxError);
    });

    it('should throw error if value has unasserted character', function () {
      assert.throws(function () {
        parseLineStrict('label:\x00');
      }, SyntaxError);
      assert.throws(function () {
        parseLineStrict('label:\x09');
      }, SyntaxError);
      assert.throws(function () {
        parseLineStrict('label:\x0D');
      }, SyntaxError);
    });

    it('should throw error if next field not found', function () {
      assert.throws(function () {
        // NOTE: \x09 is "\t"
        parseLine('label:\x09');
      }, SyntaxError);
    });

    it('should throw error if field not has separator', function () {
      assert.throws(function () {
        parseLineStrict('label');
      }, SyntaxError);
    });
  });
});
