var assert = require('chai').assert,
    ltsv_formatter = require('../lib/ltsv_formatter');

suite('ltsv_formatterのテスト', function() {

  suite('format関数のテスト', function() {});
  suite('formatLine関数のテスト', function() {});
  suite('formatStrict関数のテスト', function() {});
  suite('formatLineStrict関数のテスト', function() {});

  suite('format_関数のテスト', function() {

    test('オブジェクトを含んだ配列からLTSV文字列が生成できること', function() {
      var array = [
        {label1: 'value1', label2: 'value2', label3: 'value3'},
        {label1: 'value1', label2: 'value2', label3: 'value3'},
        {label1: 'value1', label2: 'value2', label3: 'value3'}
      ];

      assert.deepEqual(ltsv_formatter.format_(array), [
            'label1:value1\tlabel2:value2\tlabel3:value3',
            'label1:value1\tlabel2:value2\tlabel3:value3',
            'label1:value1\tlabel2:value2\tlabel3:value3'
          ].join('\n'),
          'format_' +
          '([{label1: "value1", label2: "value2", label3: "value3"} x 3]) ' +
          'should be returned ' +
          '"label1:value1\\tlabel2:value2\\tlabel3:value3\\n" x 3 - "\\n"');
    });

    test('配列以外の引数が渡された場合例外を投げること', function() {
      assert.throws(function() {
        ltsv_formatter.format_(1);
      }, 'parameter ltsvList should be a Array, not 1',
      'format_(1) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.format_('a');
      }, 'parameter ltsvList should be a Array, not a',
      'format_("a") should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.format_(true);
      }, 'parameter ltsvList should be a Array, not true',
      'format_(true) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.format_(void 0);
      }, 'parameter ltsvList should be a Array, not undefined',
      'format_(undefined) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.format_(null);
      }, 'parameter ltsvList should be a Array, not null',
      'format_(null) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.format_({});
      }, 'parameter ltsvList should be a Array, not [object Object]',
      'format_({}) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.format_(function() {});
      }, 'parameter ltsvList should be a Array, not function () {}',
      'format_(function(){}) should be threw TypeError');
    });

  });

  suite('formatLine_関数のテスト', function() {

    test('オブジェクトからLTSV文字列が生成できること', function() {
      var obj = {
        label1: 'value1',
        label2: 'value2',
        label3: 'value3'
      };

      assert.strictEqual(ltsv_formatter.formatLine_(obj),
          'label1:value1\tlabel2:value2\tlabel3:value3',
          'formatLine_' +
          '({label1: "value1", label2: "value2", label3: "value3"}) ' +
          'should be returned "label1:value1\\tlabel2:value2\\tlabel3:value3"');
    });

    test('オブジェクト以外の引数が渡された場合例外を投げること', function() {
      assert.throws(function() {
        ltsv_formatter.formatLine_(1);
      }, 'parameter recordObj should be a Object, not 1',
      'formatLine_(1) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.formatLine_('a');
      }, 'parameter recordObj should be a Object, not a',
      'formatLine_("a") should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.formatLine_(true);
      }, 'parameter recordObj should be a Object, not true',
      'formatLine_(true) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.formatLine_(void 0);
      }, 'parameter recordObj should be a Object, not undefined',
      'formatLine_(undefined) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.formatLine_(null);
      }, 'parameter recordObj should be a Object, not null',
      'formatLine_(null) should be threw TypeError');

      assert.throws(function() {
        ltsv_formatter.formatLine_(function() {});
      }, 'parameter recordObj should be a Object, not function () {}',
      'formatLine_(function(){}) should be threw TypeError');
    });

    suite('checkなし', function() {

      test('ラベルに使用できない文字を含んでいても生成できること', function() {
        var field = {'+': ''};

        assert.strictEqual(ltsv_formatter.formatLine_(field), '+:',
            'formatLine_({"+": ""}) shoudle be returned "+:"');
        assert.doesNotThrow(function() {
          ltsv_formatter.formatLine_(field);
        }, SyntaxError,
            'formatLine_({"+": ""}) should not be threw SyntaxError');
      });

      test('値に\\x00,\\x09,\\x0A,\\x0Dを含んでいても生成できること',
          function() {
            var field = {label: '\x00\x09\x0A\x0D'}

            assert.strictEqual(ltsv_formatter.formatLine_(field),
                'label:\x00\x09\x0A\x0D',
                'formatLine_({label: "\\x00\\x09\\x0A\\x0D"}) ' +
                'should be returned "label:\\x00\\x09\\x0A\\x0D"');
            assert.doesNotThrow(function() {
              ltsv_formatter.formatLine_(field);
            }, SyntaxError,
                'formatLine_({label: "\\x00\\x09\\x0A\\x0D"}) ' +
                'should not be threw SyntaxError');
          });
    });

    suite('checkあり', function() {

      test('ラベルに使用できない文字を含む場合は例外を投げること', function() {
        assert.throws(function() {
          ltsv_formatter.formatLine_({'+': ''}, true);
        }, 'unexpected character of label: "+"',
        'formatLine_({"+": ""}) should be threw SyntaxError');
      });

      test('値に\\x00,\\x09,\\x0A,\\x0Dを含む場合は例外を投げること',
          function() {

            assert.throws(function() {
              ltsv_formatter.formatLine_({label: '\x00'}, true);
            }, 'unexpected character of value: "\x00"',
            'formatLine_({label: "\\x00"}) should be threw SyntaxError');

            assert.throws(function() {
              ltsv_formatter.formatLine_({label: '\x09'}, true);
            }, 'unexpected character of value: "\x09"',
            'formatLine_({label: "\\x09"}) should be threw SyntaxError');

            assert.throws(function() {
              ltsv_formatter.formatLine_({label: '\x0A'}, true);
            }, 'unexpected character of value: "\x0A"',
            'formatLine_({label: "\\x0A"}) should be threw SyntaxError');

            assert.throws(function() {
              ltsv_formatter.formatLine_({label: '\x0D'}, true);
            }, 'unexpected character of value: "\x0D"',
            'formatLine_({label: "\\x0D"}) should be threw SyntaxError');

          });

    });

  });

});
