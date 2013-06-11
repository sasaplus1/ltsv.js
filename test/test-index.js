var assert = require('chai').assert,
    ltsv = require('../');

suite('index', function() {

  test('not exports other functions', function() {
    var parser = require('../lib/parser'),
        formatter = require('../lib/formatter'),
        stream = require('../lib/stream'),
        ltsvMock = {
          parse: parser.parse,
          parseLine: parser.parseLine,
          parseStrict: parser.parseStrict,
          parseLineStrict: parser.parseLineStrict,
          format: formatter.format,
          formatStrict: formatter.formatStrict,
          createLtsvToJsonStream: stream.createLtsvToJsonStream
        };

    assert.deepEqual(
        ltsv,
        ltsvMock,
        'ltsv should not be export other functions');
  });

});
