// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

var stream = require('stream'),
    util = require('util'),
    ltsvParser = require('./ltsv_parser'),
    splitStream = require('split-stream');

function LtsvToJsonStream(options) {
  stream.call(this);

  this.readable = true;
  this.writable = true;

  this.closed_ = false;
  this.buffer_ = [];

  this.toObject_ = options.toObject || false;
  this.isStrict_ = options.strict || false;

  this.onError_ = getOnError_(this);
  this.onClose_ = getOnClose_(this);
  this.onDrain_ = getOnDrain_(this);
  this.onData_ = getOnData_(this);
  this.onEnd_ = getOnEnd_(this);

  this.splitStream_ = splitStream.create();
  this.splitStream_.on('error', this.onError_);
  this.splitStream_.on('close', this.onClose_);
  this.splitStream_.on('drain', this.onDrain_);
  this.splitStream_.on('data', this.onData_);
  this.splitStream_.on('end', this.onEnd_);
}

util.inherits(LtsvToJsonStream, stream);

LtsvToJsonStream.prototype.destroy = function() {
  if (this.closed_) {
    return this.error_();
  }

  this.splitStream_.destroy();
  this.splitStream_.removeListener('error', this.onError_);
  this.splitStream_.removeListener('close', this.onClose_);
  this.splitStream_.removeListener('drain', this.onDrain_);
  this.splitStream_.removeListener('data', this.onData_);
  this.splitStream_.removeListener('end', this.onEnd_);
  this.splitStream_ = null;

  this.closed_ = true;
  this.readable = false;
  this.writable = false;
};

LtsvToJsonStream.prototype.setEncoding = function(encoding) {
  if (this.closed_) {
    return this.error_();
  }

  return this.splitStream_.setEncoding(encoding);
};

LtsvToJsonStream.prototype.pause = function() {
  if (this.closed_) {
    return this.error_();
  }

  return this.splitStream_.pause();
};

LtsvToJsonStream.prototype.resume = function() {
  if (this.closed_) {
    return this.error_();
  }

  return this.splitStream_.resume();
};

LtsvToJsonStream.prototype.write = function(chunk, encoding) {
  if (this.closed_) {
    return this.error_();
  }

  return this.splitStream_.write(chunk, encoding);
};

LtsvToJsonStream.prototype.end = function(chunk, encoding) {
  if (this.closed_) {
    return this.error_();
  }

  return this.splitStream_.end(chunk, encoding);
};

LtsvToJsonStream.prototype.error_ = function() {
  this.emit('error', new Error('LtsvToJsonStream closed'));
  this.readable = false;
  this.writable = false;
};

function getOnError_(that) {
  return function(err) {
    that.emit('error', err);
  };
}

function getOnClose_(that) {
  return function() {
    that.emit('close');
  };
}

function getOnDrain_(that) {
  return function() {
    that.emit('drain');
  };
}

function getOnData_(that) {
  var parseLine = (that.isStrict_) ?
          ltsvParser.parseLineStrict : ltsvParser.parseLine;

  return function(chunk) {
    var parsedChunk, beforeChunk;

    that.buffer_.push(chunk);

    // return if end of file is /\r?\n/
    if (that.buffer_.length <= 1 && chunk === '') {
      return;
    }

    beforeChunk = that.buffer_.shift();

    try {
      parsedChunk = parseLine(beforeChunk);
    } catch (e) {
      return that.emit('error', e);
    }

    that.emit('data',
        (that.toObject_) ? parsedChunk : JSON.stringify(parsedChunk));
  };
}

function getOnEnd_(that) {
  return function() {
    that.emit('end');
  };
}

function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options || {});
}

module.exports = {
  createLtsvToJsonStream: createLtsvToJsonStream
};
