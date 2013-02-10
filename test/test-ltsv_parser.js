var assert = require('chai').assert,
    ltsv_parser = require('../lib/ltsv_parser');

suite('ltsv_parserのテスト', function() {

  suite('parse関数のテスト', function() {});
  suite('parseLine関数のテスト', function() {});
  suite('parseStrict関数のテスト', function() {});
  suite('parseLineStrict関数のテスト', function() {});

  suite('parse_関数のテスト', function() {

    test('LTSVをレコードに分割できること', function() {
      var record = ltsv_parser.parse_('label:value');

      assert.deepEqual(record, [{label: 'value'}],
          'parse_("label:value") should be returned [{label: "value"}]');
    });

    test('LTSVを複数のレコードに分割できること', function() {
      var ltsv = [
        'label1:value1\tlabel2:value2\tlabel3:value3',
        'label1:value1\tlabel2:value2\tlabel3:value3',
        'label1:value1\tlabel2:value2\tlabel3:value3'
      ];

      var recordLf = ltsv_parser.parse_(ltsv.concat().join('\n')),
          recordCrlf = ltsv_parser.parse_(ltsv.concat().join('\r\n'));

      assert.deepEqual(recordLf, [
        {label1: 'value1', label2: 'value2', label3: 'value3'},
        {label1: 'value1', label2: 'value2', label3: 'value3'},
        {label1: 'value1', label2: 'value2', label3: 'value3'}
      ], 'parse_("label1:value1\\tlabel2:value2\\tlabel3:value3\\n" ' +
          'x 3) should be returned ' +
          '[{label1: "value1", label2: "value2", label3: "value3"} x 3]');

      assert.deepEqual(recordCrlf, [
        {label1: 'value1', label2: 'value2', label3: 'value3'},
        {label1: 'value1', label2: 'value2', label3: 'value3'},
        {label1: 'value1', label2: 'value2', label3: 'value3'}
      ], 'parse_("label1:value1\\tlabel2:value2\\tlabel3:value3\\r\\n" ' +
          'x 3) should be returned ' +
          '[{label1: "value1", label2: "value2", label3: "value3"} x 3]');
    });

  });

  suite('parseLine_関数のテスト', function() {

    test('レコードをフィールドに分割できること', function() {
      var field = ltsv_parser.parseLine_('label:value');

      assert.deepEqual(field, {
        label: 'value'
      }, 'parseLine_("label:value") should be returned {label: "value"}');
    });

    test('レコードを複数のフィールドに分割できること', function() {
      var field = ltsv_parser.parseLine_([
        'label1:value1',
        'label2:value2',
        'label3:value3'
      ].join('\t'));

      assert.deepEqual(field, {
        label1: 'value1',
        label2: 'value2',
        label3: 'value3'
      }, 'parseLine_("label1:value1\\tlabel2:value2\\tlabel3:value3") ' +
          'should be returned ' +
          '{label1: "value1", label2: "value2", label3: "value3"}');
    });

    test('レコードの末尾にある改行コードを削除できること', function() {
      var str = [
        'label1:value1',
        'label2:value2',
        'label3:value3'
      ].join('\t');

      var fieldLf = ltsv_parser.parseLine_(str + '\n'),
          fieldCrlf = ltsv_parser.parseLine_(str + '\r\n');

      assert.deepEqual(fieldLf, {
        label1: 'value1',
        label2: 'value2',
        label3: 'value3'
      }, 'parseLine_("label1:value1\\tlabel2:value2\\tlabel3:value3\\n") ' +
          'should be returned ' +
          '{label1: "value1", label2: "value2", label3: "value3"}');

      assert.deepEqual(fieldCrlf, {
        label1: 'value1',
        label2: 'value2',
        label3: 'value3'
      }, 'parseLine_("label1:value1\\tlabel2:value2\\tlabel3:value3\\r\\n") ' +
          'should be returned ' +
          '{label1: "value1", label2: "value2", label3: "value3"}');
    });

  });

  suite('splitField_関数のテスト', function() {

    test('フィールドを":"で分割できること', function() {
      var field = ltsv_parser.splitField_('label:value');

      assert.deepEqual(field, {
        label: 'label',
        value: 'value'
      }, 'splitField_("label:value") should be returned ' +
          '{label: "label", value: "value"}');
    });

    test('複数の":"がある場合最初の":"で分割すること', function() {
      var field = ltsv_parser.splitField_('label:value:value:value');

      assert.deepEqual(field, {
        label: 'label',
        value: 'value:value:value'
      }, 'splitField_("label:value:value:value") should be returned ' +
          '{label: "label", value: "value:value:value"}');
    });

    test('":"がない場合は例外を投げること', function() {
      assert.throws(function() {
        ltsv_parser.splitField_('label');
      }, 'field separator not found: "label"',
      'splitField_("label") should be threw SyntaxError');
    });

    test('ラベルに使用できない文字を含んでいても分割できること', function() {
      var fieldStr = '+:';

      assert.deepEqual(ltsv_parser.splitField_(fieldStr), {
        label: '+',
        value: ''
      }, 'splitField_("+:") should be returned {label: "+", value: ""}');
      assert.doesNotThrow(function() {
        ltsv_parser.splitField_(fieldStr);
      }, SyntaxError, 'splitField_("+:") should not be threw SyntaxError');
    });

    test('値に\\x00,\\x09,\\x0A,\\x0Dを含んでいても分割できること', function() {
      var fieldStr = 'label:\x00\x09\x0A\x0D';

      assert.deepEqual(ltsv_parser.splitField_(fieldStr), {
        label: 'label',
        value: '\x00\x09\x0A\x0D'
      }, 'splitField_("label:\\x00\\x09\\x0A\\x0D") should be returned ' +
          '{label: "label", value: "\\x00\\x09\\x0A\\x0D"}');
      assert.doesNotThrow(function() {
        ltsv_parser.splitField_(fieldStr);
      }, SyntaxError,
      'parser_("label:\\x00\\x09\\x0A\\x0D") should not be threw SyntaxError');
    });

  });

  suite('splitFieldStrict_関数のテスト', function() {

    test('ラベルに使用できない文字を含む場合は例外を投げること', function() {
      assert.throws(function() {
        ltsv_parser.splitFieldStrict_('+:');
      }, 'unexpected character of label: "+"',
      'splitFieldStrict_("+:") should be threw SyntaxError');
    });

    test('値に\\x00,\\x09,\\x0A,\\x0Dを含む場合は例外を投げること', function() {
      assert.throws(function() {
        ltsv_parser.splitFieldStrict_('label:\x00');
      }, 'unexpected character of value: "\x00"',
      'splitFieldStrict_("label:\\x00") should be threw SyntaxError');

      assert.throws(function() {
        ltsv_parser.splitFieldStrict_('label:\x09');
      }, 'unexpected character of value: "\x09"',
      'splitFieldStrict_("label:\\x09") should be threw SyntaxError');

      assert.throws(function() {
        ltsv_parser.splitFieldStrict_('label:\x0A');
      }, 'unexpected character of value: "\x0A"',
      'splitFieldStrict_("label:\\x0A") should be threw SyntaxError');

      assert.throws(function() {
        ltsv_parser.splitFieldStrict_('label:\x0D');
      }, 'unexpected character of value: "\x0D"',
      'splitFieldStrict_("label:\\x0D") should be threw SyntaxError');
    });

  });

});
