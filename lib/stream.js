var stream = require('stream'),
    stringDecoder = require('string_decoder').StringDecoder,
    util = require('util'),
    parser = require('./parser');


/**
 * inherit from Stream.Transform.
 */
util.inherits(LtsvToJsonStream, stream.Transform);



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


/**
 * transform chunk.
 *
 * @param {Buffer|Array} chunk chunk string.
 * @param {String} encoding encoding of chunk.
 * @param {Function} callback callback function.
 */
LtsvToJsonStream.prototype._transform = function(chunk, encoding, callback) {
  var text = this.buffer_ + this.decoder_.write(chunk),
      data = text.split(/\r?\n/);

  this.buffer_ = data.pop();
  this.splits_ = data;
  this.append_(this.splits_, callback);
};


/**
 * transform end of chunk.
 *
 * @param {Function} callback callback function.
 */
LtsvToJsonStream.prototype._flush = function(callback) {
  var text = this.buffer_ + this.decoder_.end(),
      data = text.split(/\r?\n/),
      last = data.length - 1;

  // remove last item if empty
  (data[last] === '') && data.pop();

  this.buffer_ = '';
  this.splits_ = this.splits_.concat(data);
  this.appendAll_(this.splits_, callback);
};


/**
 * append records to stream.
 *
 * @private
 * @param {String[]} lines line strings.
 * @param {Function} callback callback function.
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
    setImmediate(function(this_, lines_, callback_) {
      this_.appendAll_(lines_, callback_);
    }, this, lines, callback);
  } else {
    this.push(null);
    (typeof callback === 'function') && callback(null);
  }
};


/**
 * create LtsvToJsonStream instance.
 *
 * @param {Object} options option object.
 * @return {LtsvToJsonStream} LtsvToJsonStream instance.
 */
function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options || {});
}


/**
 * export.
 */
module.exports = {
  createLtsvToJsonStream: createLtsvToJsonStream
};
