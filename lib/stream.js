/*!
 * ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */

var stream = require('stream'),
    stringDecoder = require('string_decoder').StringDecoder,
    util = require('util'),
    parser = require('./parser');



/**
 * constructor of LtsvToJsonStream.
 *
 * @private
 * @constructor
 * @param {Object} options options object.
 */
function LtsvToJsonStream(options) {
  options.objectMode = true;
  options.decodeStrings = true;

  stream.Transform.call(this, options);

  this.toObject_ = options.toObject || false;
  this.isStrict_ = options.strict || false;

  this.parseLine_ =
      (this.isStrict_) ? parser.parseLineStrict : parser.parseLine;

  this.buffer_ = '';
  this.splits_ = [];
  this.decoder_ = new stringDecoder(options.encoding || 'utf8');
}

util.inherits(LtsvToJsonStream, stream.Transform);


/**
 * transform chunk.
 *
 * @param {Buffer|Array} chunk chunk string.
 * @param {String} encoding encoding of chunk.
 * @param {Function} callback callback function.
 */
LtsvToJsonStream.prototype._transform = function(chunk, encoding, callback) {
  var text = this.buffer_ + this.decoder_.write(chunk),
      data = this.splitToLines_(text);

  this.buffer_ = data.tail;
  this.splits_ = data.lines;
  this.append_(this.splits_, callback);
};


/**
 * transform end of chunk.
 *
 * @param {Function} callback callback function.
 */
LtsvToJsonStream.prototype._flush = function(callback) {
  var text = this.buffer_ + this.decoder_.end(),
      data = this.splitToLines_(text);

  // not append if end of line is empty.
  if (data.tail === '') {
    this.splits_ = this.splits_.concat(data.lines);
  } else {
    this.splits_ = this.splits_.concat(data.lines, [data.tail]);
  }

  this.buffer_ = '';
  this.appendAll_(this.splits_, callback);
};


/**
 * append records to stream.
 *
 * @private
 * @param {String[]} lines line strings.
 * @param {Function} callback callback function.
 * @return {Undefined} undefined.
 */
LtsvToJsonStream.prototype.append_ = function(lines, callback) {
  var i, len, line, record;

  try {
    for (i = 0, len = lines.length; i < len; ++i) {
      line = lines.shift();
      record = this.parseLine_(line);

      if (!this.toObject_) {
        record = JSON.stringify(record);
      }

      if (!this.push(record)) {
        lines.unshift(line);
        break;
      }
    }
  } catch (e) {
    return this.emit('error', e);
  }

  (typeof callback === 'function') && callback(null);
};


/**
 * append all records to stream.
 *
 * @private
 * @param {String[]} lines line strings.
 * @param {Function} callback callback function.
 */
LtsvToJsonStream.prototype.appendAll_ = function(lines, callback) {
  this.append_(lines);

  if (lines.length > 0) {
    setImmediate(function(that) {
      that.appendAll_(lines, callback);
    }, this);
  } else {
    this.push(null) && (typeof callback === 'function') && callback(null);
  }
};


/**
 * split to lines from text.
 *
 * @private
 * @param {String} text text string.
 * @return {Object} lines and tail text.
 */
LtsvToJsonStream.prototype.splitToLines_ = function(text) {
  var curr = 0,
      prev = 0,
      lines = [];

  while ((curr = text.indexOf('\n', prev)) !== -1) {
    lines.push(text.slice(prev, curr));
    prev = curr + 1;
  }

  return {
    lines: lines,
    tail: text.slice(prev)
  };
};


/**
 * return new LtsvToJsonStream instance.
 *
 * @param {Object} options option object.
 * @return {LtsvToJsonStream} LtsvToJsonStream instance.
 */
function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options || {});
}


/**
 * export createLtsvToJsonStream function.
 */
module.exports = {
  createLtsvToJsonStream: createLtsvToJsonStream
};
