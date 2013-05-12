var assert = require('chai').assert,
    ltsv_to_json_stream;

suite('ltsv_to_json_stream2のテスト', function() {

  // no test if node.js version under 0.8
  if (!require('stream').Transform) {
    return test('stream2 is not implemented.');
  }

  ltsv_to_json_stream = require('../lib/ltsv_to_json_stream2');

  suite('コンストラクタのテスト', function() {

    var ltsvParser = require('../lib//ltsv_parser');

    test('引数を渡さずに生成できること', function() {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream();

      assert.strictEqual(ltjs.toObject_, false,
          'toObject_ should be false');
      assert.strictEqual(ltjs.parseLine_, ltsvParser.parseLine,
          'parseLine_ should be parseLine');
    });

    test('引数を渡して生成できること', function() {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream({
        toObject: true,
        strict: true
      });

      assert.strictEqual(ltjs.toObject_, true,
          'toObject_ should be true');
      assert.strictEqual(ltjs.parseLine_, ltsvParser.parseLineStrict,
          'parseLine_ should be parseLineStrict');
    });

  });

  suite('write/endメソッドのテスト', function() {

    test('LTSVがJSONに変換されて渡されること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [
          '{"l1":"v1","l2":"v2"}',
          '{"l3":"v3","l4":"v4"}'
        ],
        'LtsvToJsonStream should be sent data event per ltsv records');
        done();
      });

      ltjs.write('l1:v1\tl2:v2');
      ltjs.end('\nl3:v3\tl4:v4');
    });

    test('LTSVがオブジェクトに変換されて渡されること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream({ toObject: true }),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [
          { l1: 'v1', l2: 'v2' },
          { l3: 'v3', l4: 'v4' }
        ],
        'LtsvToJsonStream should be sent data event per ltsv records');
        done();
      });

      ltjs.write('l1:v1\tl2:v2');
      ltjs.end('\nl3:v3\tl4:v4');
    });

    test('改行がない場合でも変換できること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [
          '{"l1":"v1","l2":"v2"}',
        ],
        'LtsvToJsonStream should be sent data event per ltsv records');
        done();
      });

      ltjs.end('l1:v1\tl2:v2');
    });

    test('parseLine関数で変換されていること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [
          '{"+++":"---"}',
          '{"***":"///"}'
        ],
        'LtsvToJsonStream should be sent data event per ltsv records');
        done();
      });

      ltjs.write('+++:---');
      ltjs.end('\n***:///');
    });

    test('parseLineStrict関数で変換されていること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream({ strict: true }),
          json = [],
          errorCount = 0;

      ltjs.on('error', function(err) {
        ++errorCount;
      });
      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [],
            'LtsvToJsonStream should be sent data event per ltsv records');
        assert.strictEqual(errorCount, 2,
            'LtsvToJsonStream should be sent error events per error record');
        done();
      });

      ltjs.write('+++:---');
      ltjs.end('\n***:///');
    });

    test('最後に改行が挿入されていてもエラーが発生しないこと', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('error', function(err) {
        throw new Error(
          'LtsvToJsonStream should not be threw error at final blank line');
      });
      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [
              '{"aaa":"bbb"}',
              '{"ccc":"ddd"}'
            ],
            'LtsvToJsonStream should be sent data event per ltsv records');
        done();
      });

      ltjs.write('aaa:bbb\n');
      ltjs.end('ccc:ddd\n');
    });

    test('途中に空行が挿入されている場合エラーが発生すること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('error', function(err) {
        assert.deepEqual(json, [
              '{"aaa":"bbb"}',
              '{"ccc":"ddd"}'
            ],
            'LtsvToJsonStream should be sent data event per ltsv records');
        done();
      });
      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read(1)) !== null) {
          json.push(buf);
        }
      });

      ltjs.write('aaa:bbb\n');
      ltjs.write('ccc:ddd\n');
      ltjs.write('\n');
      ltjs.end('eee:fff\n');
    });

  });

});
