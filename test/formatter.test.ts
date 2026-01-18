import { assert, describe, it } from 'vitest';

import { format, formatStrict } from '../src/formatter';

describe('formatter', () => {
  describe('#format()', () => {
    it('should generate LTSV string from object', () => {
      assert(
        format({
          label1: 'value1',
          label2: 'value2'
        }) === 'label1:value1\tlabel2:value2'
      );
    });

    it('should generate LTSV string from object in array', () => {
      assert(
        format([
          { l1: 'v1', l2: 'v2' },
          { l3: 'v3', l4: 'v4' }
        ]) === 'l1:v1\tl2:v2\nl3:v3\tl4:v4'
      );
    });

    it('should throw error if arg is not an object or array', () => {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
      assert.throws(() => {
        format(1 as any);
      }, TypeError);
      assert.throws(() => {
        format('a' as any);
      }, TypeError);
      assert.throws(() => {
        format(true as any);
      }, TypeError);
      assert.throws(() => {
        format(null as any);
      }, TypeError);
      assert.throws(() => {
        format(undefined as any);
      }, TypeError);
      assert.throws(() => {
        format((() => {}) as any);
      }, TypeError);
      if (typeof Symbol === 'function' && typeof Symbol() === 'symbol') {
        assert.throws(() => {
          format(Symbol() as any);
        });
      }
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
    });

    it('should generate record if label has unexpected character', () => {
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

    it('should generate record if value has unexpected character', () => {
      assert(
        format({
          label: '\x00\x09\x0A\x0D'
        }) === 'label:\x00\x09\x0A\x0D'
      );
    });
  });

  describe('#formatStrict()', () => {
    it('should generate LTSV string from object', () => {
      assert(
        formatStrict({
          label1: 'value1',
          label2: 'value2'
        }) === 'label1:value1\tlabel2:value2'
      );
    });

    it('should generate LTSV string from object in array', () => {
      assert(
        formatStrict([
          { l1: 'v1', l2: 'v2' },
          { l3: 'v3', l4: 'v4' }
        ]) === 'l1:v1\tl2:v2\nl3:v3\tl4:v4'
      );
    });

    it('should throw error if arg is not an object or array', () => {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
      assert.throws(() => {
        formatStrict(1 as any);
      }, TypeError);
      assert.throws(() => {
        formatStrict('a' as any);
      }, TypeError);
      assert.throws(() => {
        formatStrict(true as any);
      }, TypeError);
      assert.throws(() => {
        formatStrict(null as any);
      }, TypeError);
      assert.throws(() => {
        formatStrict(undefined as any);
      }, TypeError);
      assert.throws(() => {
        formatStrict((() => {}) as any);
      }, TypeError);
      if (typeof Symbol === 'function' && typeof Symbol() === 'symbol') {
        assert.throws(() => {
          formatStrict(Symbol() as any);
        });
      }
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
    });

    it('should throw error if label has unexpected character', () => {
      assert.throws(() => {
        formatStrict({ '\x00\x2C': 'v' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ '\x2F': 'v' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ '\x3B\x40': 'v' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ '\x5B\x5E': 'v' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ '\x60': 'v' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ '\x7B\xFF': 'v' });
      }, SyntaxError);
    });

    it('should throw error if value has unexpected character', () => {
      assert.throws(() => {
        formatStrict({ label: '\x00' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ label: '\x09' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ label: '\x0A' });
      }, SyntaxError);
      assert.throws(() => {
        formatStrict({ label: '\x0D' });
      }, SyntaxError);
    });
  });

  describe('#stringify()', () => {
    it.skip('not impelemented');
  });
});
