var fs = require('fs'),
    path = require('path'),
    assert = require('chai').assert,
    stream = require('../lib/stream');

suite('stream', function() {

  suite('#createLtsvToJsonStream()', function() {

    test('can create instance if not has parameter', function() {
      var ltjs = stream.createLtsvToJsonStream();

      assert.isFalse(
          ltjs.toObject_,
          'toObject_ should be false');
      assert.isFalse(
          ltjs.isStrict_,
          'isStrict_ should be false');
    });

    test('can create instance if has parameter', function() {
      var ltjs = stream.createLtsvToJsonStream({
        toObject: true,
        strict: true
      });

      assert.isTrue(
          ltjs.toObject_,
          'toObject_ should be true');
      assert.isTrue(
          ltjs.isStrict_,
          'isStrict_ should be true');
    });

  });

  suite('#write() and #end()', function() {

    test('can convert to JSON from LTSV', function(done) {
      var ltjs = stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        assert.deepEqual(
            json,
            [
              '{"label1":"value1","label2":"value2"}',
              '{"label3":"value3","label4":"value4"}'
            ],
            'LtsvToJsonStream should be sent record');
        done();
      });

      ltjs.write('label1:value1\tlabel2:value2');
      ltjs.end('\nlabel3:value3\tlabel4:value4');
    });

    test('can convert to JSON if LTSV has empty line of end', function(done) {
      var ltjs = stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        assert.deepEqual(
            json,
            [
              '{"label1":"value1","label2":"value2"}',
              '{"label3":"value3","label4":"value4"}'
            ],
            'LtsvToJsonStream should be sent record');
        done();
      });

      ltjs.write('label1:value1\tlabel2:value2');
      ltjs.end('\nlabel3:value3\tlabel4:value4\n');
    });

    test('throw error if illegal LTSV', function(done) {
      var ltjs = stream.createLtsvToJsonStream();

      ltjs.once('error', function(err) {
        assert.isNotNull(
            err,
            'err should not be null');
        done();
      });

      ltjs.end('\t');
    });

    suite('toObject mode', function() {

      test('can convert to Object from LTSV', function(done) {
        var ltjs = stream.createLtsvToJsonStream({ toObject: true }),
            json = [];

        ltjs.on('readable', function() {
          var buf;

          while ((buf = ltjs.read()) !== null) {
            json.push(buf);
          }
        });
        ltjs.once('end', function() {
          assert.deepEqual(
              json,
              [
                {label1: 'value1', label2: 'value2'},
                {label3: 'value3', label4: 'value4'}
              ],
              'LtsvToJsonStream should be sent record');
          done();
        });

        ltjs.write('label1:value1\tlabel2:value2');
        ltjs.end('\nlabel3:value3\tlabel4:value4');
      });

    });

    suite('isStrict mode', function() {

      test('throw error if LTSV has unexpected character', function(done) {
        var ltjs = stream.createLtsvToJsonStream({ strict: true });

        ltjs.once('error', function(err) {
          assert.isNotNull(
              err,
              'err should not be null');
          done();
        });

        ltjs.end('+:');
      });

    });

  });

  suite('#pipe()', function() {

    var ltjs;

    setup(function() {
      ltjs = stream.createLtsvToJsonStream();
    });

    teardown(function() {
      ltjs = null;
    });

    test('convert 1 line LTSV log', function(done) {
      var json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        assert.deepEqual(
            json,
            [
              '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
            ],
            'LtsvToJsonStream should be sent record');
        done();
      });

      fs.createReadStream(
          path.join(__dirname, './log/valid-1.ltsv')).pipe(ltjs);
    });

    test('convert 3 line LTSV log', function(done) {
      var json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        assert.deepEqual(
            json,
            [
              '{"aaa":"bbb","ccc":"ddd","eee":"fff"}',
              '{"aaa":"bbb","ccc":"ddd","eee":"fff"}',
              '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
            ],
            'LtsvToJsonStream should be sent record');
        done();
      });

      fs.createReadStream(
          path.join(__dirname, './log/valid-3.ltsv')).pipe(ltjs);
    });

    test('throw error if invalid LTSV log', function(done) {
      // XXX: why fail when use ltjs.once?
      ltjs.on('error', function(err) {
        assert.isNotNull(
            err,
            'err should not be null');
        done();
      });

      fs.createReadStream(
          path.join(__dirname, './log/invalid.ltsv')).pipe(ltjs);
    });

  });

  suite('#splitToLines_()', function() {

    test('can split to lines', function() {
      var ltjs = stream.createLtsvToJsonStream();

      assert.deepEqual(
          ltjs.splitToLines_(''),
          {
            lines: [],
            tail: ''
          },
          'splitToLines_("") should not be splitted');
      assert.deepEqual(
          ltjs.splitToLines_('line'),
          {
            lines: [],
            tail: 'line'
          },
          'splitToLines_("line") should not be splitted');
      assert.deepEqual(
          ltjs.splitToLines_('1\n2\n3\n4\n5\n'),
          {
            lines: [
              '1', '2', '3', '4', '5'
            ],
            tail: ''
          },
          'splitToLines_("1\n2\n3\n4\n5\n") should be splitted to lines');
      assert.deepEqual(
          ltjs.splitToLines_('\n\n\n'),
          {
            lines: [
              '', '', ''
            ],
            tail: ''
          },
          'splitToLines_("\n\n\n") should be splitted to lines');
      assert.deepEqual(
          ltjs.splitToLines_('line\nend'),
          {
            lines: [
              'line'
            ],
            tail: 'end'
          },
          'splitToLines_("line\nend") should be splitted to lines');
    });

  });

});
