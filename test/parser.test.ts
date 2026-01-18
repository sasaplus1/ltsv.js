import { assert, describe, it } from 'vitest';

import { parse, parseLine, parseLineStrict, parseStrict } from '../src/parser';

describe('parser', () => {
  describe('#parse()', () => {
    it('should return array', () => {
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

    it('should return array if value not found', () => {
      assert.deepStrictEqual(parse('label:'), [{ label: '' }]);
      assert.deepStrictEqual(parse('label:\x0A'), [{ label: '' }]);
      assert.deepStrictEqual(parse('label:\x0D\x0A'), [{ label: '' }]);
    });

    it('should return array if field has any separator', () => {
      assert.deepStrictEqual(parse('label:v:a:l:u:e'), [
        { label: 'v:a:l:u:e' }
      ]);
    });

    it('should return array if label has unasserted character', () => {
      assert.deepStrictEqual(parse('\x00\x2C:'), [{ '\x00\x2C': '' }]);
      assert.deepStrictEqual(parse('\x2F:'), [{ '\x2F': '' }]);
      // NOTE: \x3A is ":"
      assert.deepStrictEqual(parse('\x3B\x40:'), [{ '\x3B\x40': '' }]);
      assert.deepStrictEqual(parse('\x5B\x5E:'), [{ '\x5B\x5E': '' }]);
      assert.deepStrictEqual(parse('\x60:'), [{ '\x60': '' }]);
      assert.deepStrictEqual(parse('\x7B\xFF:'), [{ '\x7B\xFF': '' }]);
    });

    it('should return array if value has unasserted character', () => {
      assert.deepStrictEqual(parse('label:\x00'), [{ label: '\x00' }]);
      assert.deepStrictEqual(parse('label:\x0D'), [{ label: '\x0D' }]);
    });

    it('shuold throw error if next field not found', () => {
      assert.throws(() => {
        // NOTE: \x09 is "\t"
        parse('label:\x09');
      }, SyntaxError);
    });

    it('should throw error if field not has separator', () => {
      assert.throws(() => {
        parse('label');
      }, SyntaxError);
    });
  });

  describe('#parseLine()', () => {
    it('should return object', () => {
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

    it('should return object if value not found', () => {
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

    it('should return object if field has any separator', () => {
      assert.deepStrictEqual(parseLine('label:v:a:l:u:e'), {
        label: 'v:a:l:u:e'
      });
    });

    it('should return object if label has unasserted character', () => {
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
    it('should return object if value has unasserted character', () => {
      assert.deepStrictEqual(parseLine('label:\x00'), {
        label: '\x00'
      });
      assert.deepStrictEqual(parseLine('label:\x0D'), {
        label: '\x0D'
      });
    });
    it('should throw error if next field not found', () => {
      assert.throws(() => {
        // NOTE: \x09 is "\t"
        parseLine('label:\x09');
      }, SyntaxError);
    });
    it('should throw error if field not has separator', () => {
      assert.throws(() => {
        parseLine('label');
      }, SyntaxError);
    });
  });

  describe('#parseStrict()', () => {
    it('should return array', () => {
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

    it('should return array if value not found', () => {
      assert.deepStrictEqual(parseStrict('label:'), [{ label: '' }]);
      assert.deepStrictEqual(parseStrict('label:\x0A'), [{ label: '' }]);
      assert.deepStrictEqual(parseStrict('label:\x0D\x0A'), [{ label: '' }]);
    });

    it('should return array if field has any separator', () => {
      assert.deepStrictEqual(parseStrict('label:v:a:l:u:e'), [
        { label: 'v:a:l:u:e' }
      ]);
    });

    it('should throw error if label has unasserted character', () => {
      assert.throws(() => {
        parseStrict('\x00\x2C:');
      }, SyntaxError);
      assert.throws(() => {
        parseStrict('\x2F:');
      }, SyntaxError);
      assert.throws(() => {
        // NOTE: \x3A is ":"
        parseStrict('\x3B\x40:');
      }, SyntaxError);
      assert.throws(() => {
        parseStrict('\x5B\x5E:');
      }, SyntaxError);
      assert.throws(() => {
        parseStrict('\x60:');
      }, SyntaxError);
      assert.throws(() => {
        parseStrict('\x7B\xFF:');
      }, SyntaxError);
    });

    it('should throw error if value has unasserted character', () => {
      assert.throws(() => {
        parseStrict('label:\x00');
      }, SyntaxError);
      assert.throws(() => {
        parseStrict('label:\x0D');
      }, SyntaxError);
    });

    it('should throw error if next field not found', () => {
      assert.throws(() => {
        // NOTE: \x09 is "\t"
        parseStrict('label:\x09');
      }, SyntaxError);
    });

    it('should throw error if field not has separator', () => {
      assert.throws(() => {
        parseStrict('label');
      }, SyntaxError);
    });
  });

  describe('#parseLineStrict()', () => {
    it('should return object', () => {
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

    it('should return object if value not found', () => {
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

    it('should return object if field has any separator', () => {
      assert.deepStrictEqual(parseLineStrict('label:v:a:l:u:e'), {
        label: 'v:a:l:u:e'
      });
    });

    it('should throw error if label has unasserted character', () => {
      assert.throws(() => {
        parseLineStrict('\x00\x2C:');
      }, SyntaxError);
      assert.throws(() => {
        parseLineStrict('\x2F');
      }, SyntaxError);
      assert.throws(() => {
        // NOTE: \x3A is ":"
        parseLineStrict('\x3B\x40:');
      }, SyntaxError);
      assert.throws(() => {
        parseLineStrict('\x5B\x5E:');
      }, SyntaxError);
      assert.throws(() => {
        parseLineStrict('\x60:');
      }, SyntaxError);
      assert.throws(() => {
        parseLineStrict('\x7B\xFF:');
      }, SyntaxError);
    });

    it('should throw error if value has unasserted character', () => {
      assert.throws(() => {
        parseLineStrict('label:\x00');
      }, SyntaxError);
      assert.throws(() => {
        parseLineStrict('label:\x09');
      }, SyntaxError);
      assert.throws(() => {
        parseLineStrict('label:\x0D');
      }, SyntaxError);
    });

    it('should throw error if next field not found', () => {
      assert.throws(() => {
        // NOTE: \x09 is "\t"
        parseLine('label:\x09');
      }, SyntaxError);
    });

    it('should throw error if field not has separator', () => {
      assert.throws(() => {
        parseLineStrict('label');
      }, SyntaxError);
    });
  });
});
