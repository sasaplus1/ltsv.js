var assert = require('chai').assert,
    parser = require('../lib/parser');

suite('parser', function() {

  suite('#parse()', function() {

    test('can split to records', function() {
      assert.deepEqual(
          parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4'),
          [
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ],
          'parse(' +
              '"l1:v1\\tl2:v2\\nl3:v3\\tl4:v4"' +
              ') should be returned [' +
              '{l1: "v1", l2: "v2"}, {l3: "v3", l4: "v4"}' +
              ']');
    });

    test('can split to fields and ignore return-code of end', function() {
      assert.deepEqual(
          parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4\n'),
          [
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ],
          'parse(' +
              '"l1:v1\\tl2:v2\\nl3:v3\\tl4:v4\\n"' +
              ') should be returned [' +
              '{l1: "v1", l2: "v2"}, {l3: "v3", l4: "v4"}' +
              ']');
      assert.deepEqual(
          parser.parse('l1:v1\tl2:v2\nl3:v3\tl4:v4\r\n'),
          [
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ],
          'parse(' +
              '"l1:v1\\tl2:v2\\nl3:v3\\tl4:v4\\r\\n"' +
              ') should be returned [' +
              '{l1: "v1", l2: "v2"}, {l3: "v3", l4: "v4"}' +
              ']');
    });

  });

  suite('#parseLine()', function() {

    test('can split to fields', function() {
      assert.deepEqual(
          parser.parseLine('label1:value1\tlabel2:value2'),
          {
            label1: 'value1',
            label2: 'value2'
          },
          'parseLine(' +
              '"label1:value1\\tlabel2:value2"' +
              ') should be returned {label1: "value1", label2: "value2"}');
    });

    test('can split to fields and ignore return-code', function() {
      assert.deepEqual(
          parser.parseLine('label1:value1\tlabel2:value2\n'),
          {
            label1: 'value1',
            label2: 'value2'
          },
          'parseLine(' +
              '"label1:value1\\tlabel2:value2\\n"' +
              ') should be returned {label1: "value1", label2: "value2"}');
      assert.deepEqual(
          parser.parseLine('label1:value1\tlabel2:value2\r\n'),
          {
            label1: 'value1',
            label2: 'value2'
          },
          'parseLine(' +
              '"label1:value1\\tlabel2:value2\\r\\n"' +
              ') should be returned {label1: "value1", label2: "value2"}');
    });

  });

  suite('#parseStrict()', function() {

    test('can split to records', function() {
      assert.deepEqual(
          parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4'),
          [
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ],
          'parseStrict(' +
              '"l1:v1\\tl2:v2\\nl3:v3\\tl4:v4"' +
              ') should be returned [' +
              '{l1: "v1", l2: "v2"}, {l3: "v3", l4: "v4"}' +
              ']');
    });

    test('can split to fields and ignore return-code of end', function() {
      assert.deepEqual(
          parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4\n'),
          [
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ],
          'parseStrict(' +
              '"l1:v1\\tl2:v2\\nl3:v3\\tl4:v4\\n"' +
              ') should be returned [' +
              '{l1: "v1", l2: "v2"}, {l3: "v3", l4: "v4"}' +
              ']');
      assert.deepEqual(
          parser.parseStrict('l1:v1\tl2:v2\nl3:v3\tl4:v4\r\n'),
          [
            {l1: 'v1', l2: 'v2'},
            {l3: 'v3', l4: 'v4'}
          ],
          'parseStrict(' +
              '"l1:v1\\tl2:v2\\nl3:v3\\tl4:v4\\r\\n"' +
              ') should be returned [' +
              '{l1: "v1", l2: "v2"}, {l3: "v3", l4: "v4"}' +
              ']');
    });

  });

  suite('#parseLineStrict()', function() {

    test('can split to fields', function() {
      assert.deepEqual(
          parser.parseLineStrict('label1:value1\tlabel2:value2'),
          {
            label1: 'value1',
            label2: 'value2'
          },
          'parseLineStrict(' +
              '"label1:value1\\tlabel2:value2"' +
              ') should be returned {label1: "value1", label2: "value2"}');
    });

    test('can split to fields and ignore return-code', function() {
      assert.deepEqual(
          parser.parseLineStrict('label1:value1\tlabel2:value2\n'),
          {
            label1: 'value1',
            label2: 'value2'
          },
          'parseLineStrict(' +
              '"label1:value1\\tlabel2:value2\\n"' +
              ') should be returned {label1: "value1", label2: "value2"}');
      assert.deepEqual(
          parser.parseLineStrict('label1:value1\tlabel2:value2\r\n'),
          {
            label1: 'value1',
            label2: 'value2'
          },
          'parseLineStrict(' +
              '"label1:value1\\tlabel2:value2\\r\\n"' +
              ') should be returned {label1: "value1", label2: "value2"}');
    });

  });

  suite('#splitField_()', function() {

    test('can split to label and value', function() {
      var field = parser.splitField_('label:value');

      assert.deepEqual(
          field,
          {
            label: 'label',
            value: 'value'
          },
          'splitField_(' +
              '"label:value"' +
              ') should be returned {label: "label", value: "value"}');
    });

    test('can split field if field has some separator', function() {
      var field = parser.splitField_('label:v:a:l:u:e');

      assert.deepEqual(
          field,
          {
            label: 'label',
            value: 'v:a:l:u:e'
          },
          'splitField_(' +
              '"label:v:a:l:u:e"' +
              ') should be returned {label: "label", value: "v:a:l:u:e"}');
    });

    test('can split field if label has unexpected character', function() {
      assert.deepEqual(
          parser.splitField_('\x00\x2C:'),
          {
            label: '\x00\x2C',
            value: ''
          },
          'splitField_(' +
          '\\x00\\x2C:' +
          ') should be returned {label: "\\x00\\x2C", value: ""}');
      assert.deepEqual(
          parser.splitField_('\x2F:'),
          {
            label: '\x2F',
            value: ''
          },
          'splitField_(' +
          '\\x2F:' +
          ') should be returned {label: "\\x2F", value: ""}');
      // \x3A is ":"
      assert.deepEqual(
          parser.splitField_('\x3B\x40:'),
          {
            label: '\x3B\x40',
            value: ''
          },
          'splitField_(' +
          '\\x3B\\x40:' +
          ') should be returned {label: "\\x3B\\x40", value: ""}');
      assert.deepEqual(
          parser.splitField_('\x5B\x5E:'),
          {
            label: '\x5B\x5E',
            value: ''
          },
          'splitField_(' +
          '\\x5B\\x5E:' +
          ') should be returned {label: "\\x5B\\x5E", value: ""}');
      assert.deepEqual(
          parser.splitField_('\x60:'),
          {
            label: '\x60',
            value: ''
          },
          'splitField_(' +
          '\\x60:' +
          ') should be returned {label: "\\x60", value: ""}');
      assert.deepEqual(
          parser.splitField_('\x7B\xFF:'),
          {
            label: '\x7B\xFF',
            value: ''
          },
          'splitField_(' +
          '\\x7B\\xFF:' +
          ') should be returned {label: "\\x7B\\xFF", value: ""}');
    });

    test('can split field if value has unexpected character', function() {
      assert.deepEqual(
          parser.splitField_('label:\x00'),
          {
            label: 'label',
            value: '\x00'
          },
          'splitField_(' +
              '"label:\\x00"' +
              ') should be returned {label: "label", value: "\\x00"}');
      assert.deepEqual(
          parser.splitField_('label:\x09'),
          {
            label: 'label',
            value: '\x09'
          },
          'splitField_(' +
              '"label:\\x09"' +
              ') should be returned {label: "label", value: "\\x09"}');
      assert.deepEqual(
          parser.splitField_('label:\x0A'),
          {
            label: 'label',
            value: '\x0A'
          },
          'splitField_(' +
              '"label:\\x0A"' +
              ') should be returned {label: "label", value: "\\x0A"}');
      assert.deepEqual(
          parser.splitField_('label:\x0D'),
          {
            label: 'label',
            value: '\x0D'
          },
          'splitField_(' +
              '"label:\\x0D"' +
              ') should be returned {label: "label", value: "\\x0D"}');
    });

    test('throw error if field not has separator', function() {
      assert.throws(
          function() {
            parser.splitField_('label');
          },
          'field separator not found: "label"',
          'splitField_("label") should be threw SyntaxError');
    });

  });

  suite('#splitFieldStrict_()', function() {

    test('can split to label and value', function() {
      assert.deepEqual(
          parser.splitFieldStrict_('label:value'),
          {
            label: 'label',
            value: 'value'
          },
          'splitFieldStrict_(' +
              '"label:value"' +
              ') should be returned {label: "label", value: "value"}');
    });

    test('can split field if field has some separator', function() {
      assert.deepEqual(
          parser.splitFieldStrict_('label:v:a:l:u:e'),
          {
            label: 'label',
            value: 'v:a:l:u:e'
          },
          'splitFieldStrict_(' +
              '"label:v:a:l:u:e"' +
              ') should be returned {label: "label", value: "v:a:l:u:e"}');
    });

    test('throw error if field not has separator', function() {
      assert.throws(
          function() {
            parser.splitFieldStrict_('label');
          },
          'field separator not found: "label"',
          'splitFieldStrict_("label") should be threw SyntaxError');
    });

    test('throw error if label has unexpected character', function() {
      assert.throws(
          function() {
            parser.splitFieldStrict_('\x00\x2C:');
          },
          'unexpected character of label: "\x00\x2C"',
          'splitFieldStrict_("\\x00\\x2C:") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('\x2F:');
          },
          'unexpected character of label: "\x2F"',
          'splitFieldStrict_("\\x2F:") should be threw SyntaxError');
      // \x3A is ":"
      assert.throws(
          function() {
            parser.splitFieldStrict_('\x3B\x40:');
          },
          'unexpected character of label: "\x3B\x40"',
          'splitFieldStrict_("\\x3B\\x40:") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('\x5B\x5E:');
          },
          'unexpected character of label: "\x5B\x5E"',
          'splitFieldStrict_("\\x5B\\x5E:") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('\x60:');
          },
          'unexpected character of label: "\x60"',
          'splitFieldStrict_("\\x60:") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('\x7B\xFF:');
          },
          'unexpected character of label: "\x7B\xFF"',
          'splitFieldStrict_("\\x7B\\xFF:") should be threw SyntaxError');
    });

    test('throw error if value has unexpected character', function() {
      assert.throws(
          function() {
            parser.splitFieldStrict_('label:\x00');
          },
          'unexpected character of value: "\x00"',
          'splitFieldStrict_("label:\\x00") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('label:\x09');
          },
          'unexpected character of value: "\x09"',
          'splitFieldStrict_("label:\\x09") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('label:\x0A');
          },
          'unexpected character of value: "\x0A"',
          'splitFieldStrict_("label:\\x0A") should be threw SyntaxError');
      assert.throws(
          function() {
            parser.splitFieldStrict_('label:\x0D');
          },
          'unexpected character of value: "\x0D"',
          'splitFieldStrict_("label:\\x0D") should be threw SyntaxError');
    });

  });

});
