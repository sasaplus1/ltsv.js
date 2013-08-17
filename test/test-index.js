var expect = require('expect.js'),
    ltsv = require('../');

describe('index', function() {

  it('should not export extra functions', function() {
    var parser = require('../lib/parser'),
        formatter = require('../lib/formatter'),
        stream = require('../lib/stream');

    expect(ltsv).to.eql({
      parse: parser.parse,
      parseLine: parser.parseLine,
      parseStrict: parser.parseStrict,
      parseLineStrict: parser.parseLineStrict,
      format: formatter.format,
      formatStrict: formatter.formatStrict,
      createLtsvToJsonStream: stream.createLtsvToJsonStream
    });
  });

});
