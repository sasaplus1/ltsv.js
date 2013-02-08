var assert = require('assert'),
    ltsv = require('../');

suite('ltsvのテスト', function() {

  suite('parse関数のテスト', function() {

    test('パースできること', function() {
      var result = ltsv.parse([
        'aaa:bbb',
        'ccc:ddd',
        'eee:fff'
      ].join('\t'));

      assert.deepEqual(result, {
        aaa: 'bbb',
        ccc: 'ddd',
        eee: 'fff'
      }, 'result has any records');
    });

    test('":"を含んでいない場合は例外が投げられること', function() {
      assert.throws(function() {
        ltsv.parse('aaa');
      }, '"aaa" has not field separator');
    });

  });

  suite('parseLines関数のテスト', function() {

    test('LFで区切られた文字列がパースできること', function() {
      var result = ltsv.parseLines([
        'aaa:bbb',
        'ccc:ddd',
        'eee:fff'
      ].join('\n'));

      assert.deepEqual(result[0], {aaa: 'bbb'},
          'result[0] has {aaa: "bbb"}');
      assert.deepEqual(result[1], {ccc: 'ddd'},
          'result[1] has {ccc: "ddd"}');
      assert.deepEqual(result[2], {eee: 'fff'},
          'result[2] has {eee: "fff"}');
    });

    test('CRLFで区切られた文字列がパースできること', function() {
      var result = ltsv.parseLines([
        'aaa:bbb',
        'ccc:ddd',
        'eee:fff'
      ].join('\r\n'));

      assert.deepEqual(result[0], {aaa: 'bbb'},
          'result[0] has {aaa: "bbb"}');
      assert.deepEqual(result[1], {ccc: 'ddd'},
          'result[1] has {ccc: "ddd"}');
      assert.deepEqual(result[2], {eee: 'fff'},
          'result[2] has {eee: "fff"}');
    });

    test('CRで区切られた文字列が一行でパースされること', function() {
      var result = ltsv.parseLines([
        'aaa:bbb',
        'ccc:ddd',
        'eee:fff'
      ].join('\r'));

      assert.deepEqual(result[0], {
        aaa: 'bbb\rccc:ddd\reee:fff'
      }, 'result[0] has {aaa: "bbb\rccc:ddd\reee:fff"}');
    });

  });

});
