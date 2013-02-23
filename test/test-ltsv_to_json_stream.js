var assert = require('chai').assert,
    ltsv_to_json_stream = require('../lib/ltsv_to_json_stream');

suite('ltsv_to_json_streamのテスト', function() {

  suite('コンストラクタのテスト', function() {

    test('引数を渡さずに生成できること', function() {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream();

      assert.strictEqual(ltjs.toObject_, false,
          'toObject_ should be false');
      assert.strictEqual(ltjs.isStrict_, false,
          'isStrict_ should be false');
    });

    test('引数を渡して生成できること', function() {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream({
        toObject: true,
        strict: true
      });

      assert.strictEqual(ltjs.toObject_, true,
          'toObject_ should be true');
      assert.strictEqual(ltjs.isStrict_, true,
          'isStrict_ should be true');
    });

  });

  suite('destroyメソッドのテスト', function() {

    test('closeイベントが送信されること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream();

      ltjs.on('close', function() {
        done();
      });

      ltjs.destroy();
    });

    test('destroyの後に各メソッドを呼ぶとerrorイベントが送信されること',
        function() {
          var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
              errorCount = 0;

          ltjs.on('error', function(err) {
            ++errorCount;
          });
          ltjs.destroy();

          ltjs.destroy();
          ltjs.setEncoding();
          ltjs.pause();
          ltjs.resume();
          ltjs.write();
          ltjs.end();

          assert.strictEqual(errorCount, 6, 'errorCount should be 6');
        });

  });

  suite('dataイベントのテスト', function() {

    test('LTSVがJSONに変換されて渡されること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('data', function(data) {
        json.push(data);
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

      ltjs.on('data', function(data) {
        json.push(data);
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

    test('parseLine関数で変換されていること', function(done) {
      var ltjs = ltsv_to_json_stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('data', function(data) {
        json.push(data);
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
      ltjs.on('data', function(data) {
        json.push(data);
      });
      ltjs.on('end', function() {
        assert.deepEqual(json, [],
            'LtsvToJsonStream should be sent data event per ltsv records');
        ltjs.destroy();
      });
      ltjs.on('close', function() {
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
      ltjs.on('data', function(data) {
        json.push(data);
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
      ltjs.on('data', function(data) {
        json.push(data);
      });

      ltjs.write('aaa:bbb\n');
      ltjs.write('ccc:ddd\n\n');
      ltjs.end('eee:fff\n');
    });

  });

});
