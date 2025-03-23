import { assert, describe, it } from 'vitest';

import { format, formatStrict } from '../src/formatter';

describe('formatter', function () {
  describe('#format()', function () {
    it('should generate LTSV string from object', function () {
      assert(
        format({
          label1: 'value1',
          label2: 'value2'
        }) === 'label1:value1\tlabel2:value2'
      );
    });

    it('should generate LTSV string from object in array', function () {
      assert(
        format([
          { l1: 'v1', l2: 'v2' },
          { l3: 'v3', l4: 'v4' }
        ]) === 'l1:v1\tl2:v2\nl3:v3\tl4:v4'
      );
    });

    it('should throw error if arg is not an object or array', function () {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
      assert.throws(function () {
        format(1 as any);
      }, TypeError);
      assert.throws(function () {
        format('a' as any);
      }, TypeError);
      assert.throws(function () {
        format(true as any);
      }, TypeError);
      assert.throws(function () {
        format(null as any);
      }, TypeError);
      assert.throws(function () {
        format(undefined as any);
      }, TypeError);
      assert.throws(function () {
        format(function () {} as any);
      }, TypeError);
      if (typeof Symbol === 'function' && typeof Symbol() === 'symbol') {
        assert.throws(function () {
          format(Symbol() as any);
        });
      }
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
    });

    it('should generate record if label has unexpected character', function () {
      assert(
        format({
          '\x00\x2C': 'v'
        }) === '\x00\x2C:v'
      );
      assert(
        format({
          '\x2F': 'v'
        }) === '\x2F:v'
      );
      // NOTE: \x3A is ":"
      assert(
        format({
          '\x3B\x40': 'v'
        }) === '\x3B\x40:v'
      );
      assert(
        format({
          '\x5B\x5E': 'v'
        }) === '\x5B\x5E:v'
      );
      assert(
        format({
          '\x60': 'v'
        }) === '\x60:v'
      );
      assert(
        format({
          '\x7B\xFF': 'v'
        }) === '\x7B\xFF:v'
      );
    });

    it('should generate record if value has unexpected character', function () {
      assert(
        format({
          label: '\x00\x09\x0A\x0D'
        }) === 'label:\x00\x09\x0A\x0D'
      );
    });
  });

  describe('#formatStrict()', function () {
    it('should generate LTSV string from object', function () {
      assert(
        formatStrict({
          label1: 'value1',
          label2: 'value2'
        }) === 'label1:value1\tlabel2:value2'
      );
    });

    it('should generate LTSV string from object in array', function () {
      assert(
        formatStrict([
          { l1: 'v1', l2: 'v2' },
          { l3: 'v3', l4: 'v4' }
        ]) === 'l1:v1\tl2:v2\nl3:v3\tl4:v4'
      );
    });

    it('should throw error if arg is not an object or array', function () {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
      assert.throws(function () {
        formatStrict(1 as any);
      }, TypeError);
      assert.throws(function () {
        formatStrict('a' as any);
      }, TypeError);
      assert.throws(function () {
        formatStrict(true as any);
      }, TypeError);
      assert.throws(function () {
        formatStrict(null as any);
      }, TypeError);
      assert.throws(function () {
        formatStrict(undefined as any);
      }, TypeError);
      assert.throws(function () {
        formatStrict(function () {} as any);
      }, TypeError);
      if (typeof Symbol === 'function' && typeof Symbol() === 'symbol') {
        assert.throws(function () {
          formatStrict(Symbol() as any);
        });
      }
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
    });

    it('should throw error if label has unexpected character', function () {
      assert.throws(function () {
        formatStrict({ '\x00\x2C': 'v' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ '\x2F': 'v' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ '\x3B\x40': 'v' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ '\x5B\x5E': 'v' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ '\x60': 'v' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ '\x7B\xFF': 'v' });
      }, SyntaxError);
    });

    it('should throw error if value has unexpected character', function () {
      assert.throws(function () {
        formatStrict({ label: '\x00' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ label: '\x09' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ label: '\x0A' });
      }, SyntaxError);
      assert.throws(function () {
        formatStrict({ label: '\x0D' });
      }, SyntaxError);
    });
  });

  describe('#stringify()', function () {
    it.skip('not impelemented');
  });
});
