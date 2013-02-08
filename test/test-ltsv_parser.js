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

  });

});
