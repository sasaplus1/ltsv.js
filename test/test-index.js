var assert = require('chai').assert,
    ltsv = require('../');

suite('ltsvのテスト', function() {

  suite('createLtsvToJsonStreamのテスト', function() {

    var hasTransform = (!!require('stream').Transform);

    // under version 0.8
    suite('old style stream', function() {

      if (hasTransform) {
        return test('stream2 is implemented.');
      }

      test('createLtsvToJsonStreamがcreateLtsvToJsonStream1であること',
        function() {
          assert.strictEqual(
              ltsv.createLtsvToJsonStream,
              ltsv.createLtsvToJsonStream1,
              'createLtsvToJsonStream should be createLtsvToJsonStream1');
        });

      test('createLtsvToJsonStream1が実装されていること', function() {
        assert.notStrictEqual(ltsv.createLtsvToJsonStream1,
            null, 'createLtsvToJsonStream1 should not be null');
      });

      test('createLtsvToJsonStream2がnullであること', function() {
        assert.strictEqual(ltsv.createLtsvToJsonStream2,
            null, 'createLtsvToJsonStream2 should be null');
      });

    });

    // over version 0.9
    suite('stream2', function() {

      if (!hasTransform) {
        return test('stream2 is not implemented.');
      }

      test('createLtsvToJsonStreamがcreateLtsvToJsonStream2であること',
        function() {
          assert.strictEqual(
              ltsv.createLtsvToJsonStream,
              ltsv.createLtsvToJsonStream2,
              'createLtsvToJsonStream should be createLtsvToJsonStream2');
        });

      test('createLtsvToJsonStream1が実装されていること', function() {
        assert.notStrictEqual(ltsv.createLtsvToJsonStream1,
            null, 'createLtsvToJsonStream1 should not be null');
      });

      test('createLtsvToJsonStream2が実装されていること', function() {
        assert.notStrictEqual(ltsv.createLtsvToJsonStream2,
            null, 'createLtsvToJsonStream2 should not be null');
      });

    });

  });

});
