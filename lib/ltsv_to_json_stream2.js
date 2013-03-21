// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

var stream = require('stream'),
    stringdecoder = require('string_decoder').StringDecoder,
    util = require('util'),
    ltsvParser = require('./ltsv_parser');

function LtsvToJsonStream(options) {
  options.objectMode = true;
  options.decodeStrings = true;

  stream.Transform.call(this, options);

  this.toObject_ = options.toObject || false;
  this.parseLine_ = (options.strict || false) ?
      ltsvParser.parseLineStrict : ltsvParser.parseLine;

  this.buffer_ = [];
  this.splits_ = [];
  this.parsed_ = [];
  this.decoder_ = new stringdecoder(options.encoding || 'utf8');
  this.splitStr_ = /\r?\n/;
}

util.inherits(LtsvToJsonStream, stream.Transform);

LtsvToJsonStream.prototype._transform = function(chunk, encoding, callback) {
  var concatedChunk = (this.buffer_.pop() || '') + this.decoder_.write(chunk),
      splittedArray = concatedChunk.split(this.splitStr_);

  this.buffer_.push(splittedArray.pop());
  this.splits_ = this.splits_.concat(splittedArray);

  this.parseLines_();
  this.transfer_(callback);
};

LtsvToJsonStream.prototype._flush = function(callback) {
  var concatedChunk = this.buffer_.join('') + this.decoder_.end(),
      splittedArray = concatedChunk.split(this.splitStr_),
      lastLine;

  this.buffer_ = [];
  this.splits_ = this.splits_.concat(splittedArray);

  lastLine = this.splits_.pop() || '';
  if (lastLine !== '') {
    this.splits_.push(lastLine);
  }

  this.parseLines_();
  this.transferAll_(callback);
};

LtsvToJsonStream.prototype.parseLines_ = function() {
  var i, len, line, record;

  for (i = 0, len = this.splits_.length; i < len; ++i) {
    line = this.splits_.shift();

    try {
      record = this.parseLine_(line);
    } catch (e) {
      return this.emit('error', e);
    }

    this.parsed_.push(
        (this.toObject_) ? record : JSON.stringify(record));
  }
};

LtsvToJsonStream.prototype.transfer_ = function(callback) {
  var i, len, record;

  for (i = 0, len = this.parsed_.length; i < len; ++i) {
    record = this.parsed_.shift();

    if (!this.push(record)) {
      this.parsed_.unshift(record);
      break;
    }
  }

  if (typeof callback === 'function') {
    callback(null);
  }
};

LtsvToJsonStream.prototype.transferAll_ = function(callback) {
  this.transfer_();

  if (this.parsed_.length > 0) {
    setImmediate(function(that) {
      that.transferAll_(callback);
    }, this);
  } else {
    this.push(null);
    callback(null);
  }
};

function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options || {});
}

module.exports = {
  createLtsvToJsonStream: createLtsvToJsonStream
};
