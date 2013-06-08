var assert = require('chai').assert,
    formatter = require('../lib/formatter');

suite('formatter', function() {

  suite('#format()', function() {

    test('can generate LTSV from object', function() {
      assert.strictEqual(
          formatter.format({
            label1: 'value1',
            label2: 'value2'
          }),
          'label1:value1\tlabel2:value2',
          'format(' +
              '{label1: "value1", label2: "value2"}' +
              ') should be returned "label1:value1\\tlabel2:value2"');
    });

    test('can generate LTSV from object in array', function() {
      assert.strictEqual(
          formatter.format([
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ]),
          'l1:v1\tl2:v2\nl3:v3\tl4:v4',
          'format([' +
              '{l1: "v1", l2: "v2"},{l3: "v3", l4: "v4"},' +
              ']) should be returned "l1:v1\\tl2:v2\\nl3:v3\\tl4:v4"');
    });

    test('throw error if parameter is not a object or array', function() {
      assert.throws(
          function() {
            formatter.format(1);
          },
          'parameter should be a Object or Array: number',
          'format(1) should be threw TypeError');
      assert.throws(
          function() {
            formatter.format('a');
          },
          'parameter should be a Object or Array: string',
          'format("a") should be threw TypeError');
      assert.throws(
          function() {
            formatter.format(true);
          },
          'parameter should be a Object or Array: boolean',
          'format(true) should be threw TypeError');
      assert.throws(
          function() {
            formatter.format(void 0);
          },
          'parameter should be a Object or Array: undefined',
          'format(undefined) should be threw TypeError');
      assert.throws(
          function() {
            formatter.format(null);
          },
          'parameter should be a Object or Array: null',
          'format(null) should be threw TypeError');
      assert.throws(
          function() {
            formatter.format(function() {});
          },
          'parameter should be a Object or Array: function',
          'format(function() {}) should be threw TypeError');
    });

  });

  suite('#formatStrict()', function() {

    test('can generate LTSV from object', function() {
      assert.strictEqual(
          formatter.formatStrict({
            label1: 'value1',
            label2: 'value2'
          }),
          'label1:value1\tlabel2:value2',
          'formatStrict(' +
              '{label1: "value1", label2: "value2"}' +
              ') should be returned "label1:value1\\tlabel2:value2"');
    });

    test('can generate LTSV from object in array', function() {
      assert.strictEqual(
          formatter.formatStrict([
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ]),
          'l1:v1\tl2:v2\nl3:v3\tl4:v4',
          'formatStrict([' +
              '{l1: "v1", l2: "v2"},{l3: "v3", l4: "v4"},' +
              ']) should be returned "l1:v1\\tl2:v2\\nl3:v3\\tl4:v4"');
    });

    test('throw error if parameter is not a object or array', function() {
      assert.throws(
          function() {
            formatter.formatStrict(1);
          },
          'parameter should be a Object or Array: number',
          'formatStrict(1) should be threw TypeError');
      assert.throws(
          function() {
            formatter.formatStrict('a');
          },
          'parameter should be a Object or Array: string',
          'formatStrict("a") should be threw TypeError');
      assert.throws(
          function() {
            formatter.formatStrict(true);
          },
          'parameter should be a Object or Array: boolean',
          'formatStrict(true) should be threw TypeError');
      assert.throws(
          function() {
            formatter.formatStrict(void 0);
          },
          'parameter should be a Object or Array: undefined',
          'formatStrict(undefined) should be threw TypeError');
      assert.throws(
          function() {
            formatter.formatStrict(null);
          },
          'parameter should be a Object or Array: null',
          'formatStrict(null) should be threw TypeError');
      assert.throws(
          function() {
            formatter.formatStrict(function() {});
          },
          'parameter should be a Object or Array: function',
          'formatStrict(function() {}) should be threw TypeError');
    });

  });

  suite('#objectToRecord_()', function() {

    test('can generate record from object', function() {
      assert.strictEqual(
          formatter.objectToRecord_({
            label1: 'value1',
            label2: 'value2'
          }),
          'label1:value1\tlabel2:value2',
          'objectToRecord_(' +
              '{label1: "value1", label2: "value2"}' +
              ') should be returned "label1:value1\\tlabel2:value2"');
    });

    test('can generate record if label has unexpected character', function() {
      assert.strictEqual(
          formatter.objectToRecord_({
            '\x00\x2C': ''
          }),
          '\x00\x2C:',
          'objectToRecord_(' +
              '{"\\x00\\x2C":""}' +
              ') should be returned "\\x00\\x2C:"');
      assert.strictEqual(
          formatter.objectToRecord_({
            '\x2F': ''
          }),
          '\x2F:',
          'objectToRecord_(' +
              '{"\\x2F":""}' +
              ') should be returned "\\x2F:"');
      // \x3A is ":"
      assert.strictEqual(
          formatter.objectToRecord_({
            '\x3B\x40': ''
          }),
          '\x3B\x40:',
          'objectToRecord_(' +
              '{"\\x3B\\x40": ""}' +
              ') should be returned "\\x3B\\x40:"');
      assert.strictEqual(
          formatter.objectToRecord_({
            '\x5B\x5E': ''
          }),
          '\x5B\x5E:',
          'objectToRecord_(' +
              '{"\\x5B\\x5E": ""}' +
              ') should be returned "\\x5B\\x5E:"');
      assert.strictEqual(
          formatter.objectToRecord_({
            '\x60': ''
          }),
          '\x60:',
          'objectToRecord_(' +
              '{"\\x60": ""}' +
              ') should be returned "\\x60:"');
      assert.strictEqual(
          formatter.objectToRecord_({
            '\x7B\xFF': ''
          }),
          '\x7B\xFF:',
          'objectToRecord_(' +
              '{"\\x7B\\xFF": ""}' +
              ') should be returned "\\x7B\\xFF:"');
    });

    test('can generate record if value has unexpected character', function() {
      assert.strictEqual(
          formatter.objectToRecord_({
            label: '\x00\x09\x0A\x0D'
          }),
          'label:\x00\x09\x0A\x0D',
          'objectToRecord_(' +
              '{label: "\\x00\\x09\\x0A\\x0D"}' +
              ') should be returned "label:\\x00\\x09\\x0A\\x0D"');
    });

    test('throw error if parameter is not a object', function() {
      assert.throws(
          function() {
            formatter.objectToRecord_(1);
          },
          'parameter should be a Object: number',
          'objectToRecord_(1) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecord_('a');
          },
          'parameter should be a Object: string',
          'objectToRecord_("a") shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecord_(true);
          },
          'parameter should be a Object: boolean',
          'objectToRecord_(true) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecord_(void 0);
          },
          'parameter should be a Object: undefined',
          'objectToRecord_(undefined) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecord_(null);
          },
          'parameter should be a Object: null',
          'objectToRecord_(null) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecord_(function() {});
          },
          'parameter should be a Object: function',
          'objectToRecord_(function() {}) shuold be threw TypeError');
    });

  });

  suite('#objectToRecordStrict_()', function() {

    test('can generate record from object', function() {
      assert.strictEqual(
          formatter.objectToRecordStrict_({
            label1: 'value1',
            label2: 'value2'
          }),
          'label1:value1\tlabel2:value2',
          'objectToRecordStrict_(' +
              '{label1: "value1", label2: "value2"}' +
              ') should be returned "label1:value1\\tlabel2:value2"');
    });

    test('throw error if parameter is not a object', function() {
      assert.throws(
          function() {
            formatter.objectToRecordStrict_(1);
          },
          'parameter should be a Object: number',
          'objectToRecordStrict_(1) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_('a');
          },
          'parameter should be a Object: string',
          'objectToRecordStrict_("a") shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_(true);
          },
          'parameter should be a Object: boolean',
          'objectToRecordStrict_(true) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_(void 0);
          },
          'parameter should be a Object: undefined',
          'objectToRecordStrict_(undefined) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_(null);
          },
          'parameter should be a Object: null',
          'objectToRecordStrict_(null) shuold be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_(function() {});
          },
          'parameter should be a Object: function',
          'objectToRecordStrict_(function() {}) shuold be threw TypeError');
    });

    test('throw error if label has unexpected character', function() {
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({'\x00\x2C': ''});
          },
          'unexpected character of label: "\x00\x2C"',
          'objectToRecordStrict_("\\x00\\x2C") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({'\x2F': ''});
          },
          'unexpected character of label: "\x2F"',
          'objectToRecordStrict_("\\x2F") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({'\x3B\x40': ''});
          },
          'unexpected character of label: "\x3B\x40"',
          'objectToRecordStrict_("\\x3B\\x40") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({'\x5B\x5E': ''});
          },
          'unexpected character of label: "\x5B\x5E"',
          'objectToRecordStrict_("\\x5B\\x5E") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({'\x60': ''});
          },
          'unexpected character of label: "\x60"',
          'objectToRecordStrict_("\\x60") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({'\x7B\xFF': ''});
          },
          'unexpected character of label: "\x7B\xFF"',
          'objectToRecordStrict_("\\x7B\\xFF") should be threw TypeError');
    });

    test('throw error if value has unexpected character', function() {
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({label: '\x00'});
          },
          'unexpected character of value: "\x00"',
          'objectToRecordStrict_("\\x00") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({label: '\x09'});
          },
          'unexpected character of value: "\x09"',
          'objectToRecordStrict_("\\x09") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({label: '\x0A'});
          },
          'unexpected character of value: "\x0A"',
          'objectToRecordStrict_("\\x0A") should be threw TypeError');
      assert.throws(
          function() {
            formatter.objectToRecordStrict_({label: '\x00'});
          },
          'unexpected character of value: "\x00"',
          'objectToRecordStrict_("\\x00") should be threw TypeError');
    });

  });

});
