/*!
 * @license ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */


/**
 *
 */
(function(global) {

  var isNode, isTest,
      parser, formatter, validator,
      util, stream;



  /**
   *
   */
  parser = (function() {
    /**
     * split from LTSV to records.
     *
     * @param {String} text LTSV string.
     * @return {Object[]} object has fields.
     */
    function parse(text) {
      return parse_(text, parseLine);
    }

    /**
     * split from record to fields.
     *
     * @param {String} line record string.
     * @return {Object} object has fields.
     */
    function parseLine(line) {
      return parseLine_(line, splitField_);
    }

    /**
     * split from LTSV to records and validate label and value of fields.
     *
     * @param {String} text LTSV string.
     * @return {Object[]} object has fields.
     */
    function parseStrict(text) {
      return parse_(text, parseLineStrict);
    }

    /**
     * split from record to fields and validate label and value of fields.
     *
     * @param {String} line record string.
     * @return {Object} object has fields.
     */
    function parseLineStrict(line) {
      return parseLine_(line, splitFieldStrict_);
    }

    /**
     * base of parse function.
     *
     * @private
     * @param {String} line record string.
     * @param {Function} fn line parse function.
     * @return {Object[]} parsed records.
     */
    function parse_(text, fn) {
      var lines = String(text).replace(/(?:\r?\n)+$/, '').split(/\r?\n/),
          records = [],
          i, len;

      for (i = 0, len = lines.length; i < len; ++i) {
        records[i] = fn(lines[i]);
      }

      return records;
    }

    /**
     * base of parseLine function.
     *
     * @private
     * @param {String} line record string.
     * @param {Function} fn field split function.
     * @return {Object} parsed record.
     */
    function parseLine_(line, fn) {
      var fields = String(line).replace(/(?:\r?\n)+$/, '').split('\t'),
          record = {},
          i, len, field;

      for (i = 0, len = fields.length; i < len; ++i) {
        field = fn(fields[i]);
        record[field.label] = field.value;
      }

      return record;
    }

    /**
     * split to label and value from field.
     *
     * @private
     * @param {String} chunk field string.
     * @throws {SyntaxError} if chunk not has separator.
     * @return {Object} parsed field.
     */
    function splitField_(chunk) {
      var field = String(chunk),
          separatorIndex = field.indexOf(':');

      if (separatorIndex === -1) {
        throw new SyntaxError('field separator not found: "' + field + '"');
      }

      return {
        label: field.slice(0, separatorIndex),
        value: field.slice(separatorIndex + 1)
      };
    }

    /**
     * split to label and value from field and validate label and value.
     *
     * @private
     * @param {String} chunk field string.
     * @throws {SyntaxError} if label or value has unexpected character.
     * @return {Object} parsed field.
     */
    function splitFieldStrict_(chunk) {
      var field = splitField_(chunk);

      if (!validator.isValidLabel(field.label)) {
        throw new SyntaxError(
            'unexpected character for label: "' + field.label + '"');
      }

      if (!validator.isValidValue(field.value)) {
        throw new SyntaxError(
            'unexpected character for value: "' + field.value + '"');
      }

      return field;
    }

    return {
      parse: parse,
      parseLine: parseLine,
      parseStrict: parseStrict,
      parseLineStrict: parseLineStrict,
      parse_: parse_,
      parseLine_: parseLine_,
      splitField_: splitField_,
      splitFieldStrict_: splitFieldStrict_
    };
  }());



  /**
   *
   */
  formatter = (function() {
    /**
     * format to LTSV from object or object array.
     *
     * @param {Object|Object[]} mixed object or object array.
     * @throws {TypeError} if parameter is not a Object
     * @return {String} LTSV string.
     */
    function format(mixed) {
      var mixedType = getType_(mixed),
          records = [],
          i, len;

      if (mixedType !== 'object') {
        throw new TypeError(
            'parameter should be an Object or Array: ' + mixedType);
      }

      if (util.isArray(mixed)) {
        for (i = 0, len = mixed.length; i < len; ++i) {
          records[i] = objectToRecord_(mixed[i]);
        }
      } else {
        records.push(objectToRecord_(mixed));
      }

      return records.join('\n');
    }

    /**
     * format to LTSV from object or object array.
     * validate label and value.
     *
     * @param {Object|Object[]} mixed object or object array.
     * @throws {TypeError} if parameter is not a Object
     * @return {String} LTSV string.
     */
    function formatStrict(mixed) {
      var mixedType = getType_(mixed),
          records = [],
          i, len;

      if (mixedType !== 'object') {
        throw new TypeError(
            'parameter should be an Object or Array: ' + mixedType);
      }

      if (util.isArray(mixed)) {
        for (i = 0, len = mixed.length; i < len; ++i) {
          records[i] = objectToRecordStrict_(mixed[i]);
        }
      } else {
        records.push(objectToRecordStrict_(mixed));
      }

      return records.join('\n');
    }

    /**
     * format to record from object.
     *
     * @private
     * @param {Object} object object.
     * @throws {TypeError} if parameter is not a Object
     * @return {String} record string.
     */
    function objectToRecord_(object) {
      var objectType = getType_(object),
          keys, fields, i, len;

      if (objectType !== 'object') {
        throw new TypeError(
            'parameter should be an Object: ' + objectType);
      }

      keys = Object.keys(object);
      fields = [];

      for (i = 0, len = keys.length; i < len; ++i) {
        fields[i] = keys[i] + ':' + object[keys[i]];
      }

      return fields.join('\t');
    }

    /**
     * format to record from object and validate label and value.
     *
     * @private
     * @param {Object} object object.
     * @throws {TypeError} if parameter is not a Object
     * @throws {SyntaxError} if label or value has unexpected character
     * @return {String} record string.
     */
    function objectToRecordStrict_(object) {
      var objectType = getType_(object),
          keys, fields, i, len, label, value;

      if (objectType !== 'object') {
        throw new TypeError(
            'parameter should be an Object: ' + objectType);
      }

      keys = Object.keys(object);
      fields = [];

      for (i = 0, len = keys.length; i < len; ++i) {
        label = keys[i];
        value = object[label];

        if (!validator.isValidLabel(label)) {
          throw new SyntaxError(
              'unexpected character for label: "' + label + '"');
        }

        if (!validator.isValidValue(value)) {
          throw new SyntaxError(
              'unexpected character for value: "' + value + '"');
        }

        fields[i] = label + ':' + value;
      }

      return fields.join('\t');
    }

    /**
     * get type of value.
     * return "null" if value is null.
     * otherwise return typeof value.
     *
     * @param {*} value value.
     * @return {String} type of value.
     */
    function getType_(value) {
      return (value === null) ? 'null' : typeof value;
    }

    return {
      format: format,
      formatStrict: formatStrict,
      objectToRecord_: objectToRecord_,
      objectToRecordStrict_: objectToRecordStrict_,
      getType_: getType_
    };
  }());



  /**
   *
   */
  validator = (function() {
    var labelRegExp = /^[0-9A-Za-z_.-]+$/,
        valueRegExp = /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/;

    /**
     * validate label.
     *
     * @param {String} label label string.
     * @return {Boolean} return true if validation success.
     */
    function isValidLabel(label) {
      return labelRegExp.test(label);
    }

    /**
     * validate value.
     *
     * @param {String} value value string.
     * @return {Boolean} return true if validation success.
     */
    function isValidValue(value) {
      return valueRegExp.test(value);
    }

    return {
      isValidLabel: isValidLabel,
      isValidValue: isValidValue
    };
  }());



  /**
   *
   */
  util = (isNode) ? require('util') : (function() {
    /**
     * check value is Array.
     *
     * @param {*} value value.
     * @return {Boolean} return true if value is Array.
     */
    function isArray_(value) {
      return (Object.prototype.toString.call(value) === '[object Array]');
    }

    return {
      /** use Array#isArray if implemented. */
      isArray: Array.isArray || isArray_
    };
  }());



  /**
   *
   */
  (isNode) && (stream = (function() {
    var stream = require('stream'),
        stringDecoder = require('string_decoder').StringDecoder;

    /** inherit from TransformStream */
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
        this.push(null);
        (typeof callback === 'function') && callback(null);
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

    return {
      createLtsvToJsonStream: createLtsvToJsonStream
    };
  }()));



  isNode = (typeof module !== 'undefined');
  isTest = (typeof Mocha !== 'undefined') ||
      (isNode && process.env.NODE_ENV === 'test');

  if (isNode) {
    /** export functions for node.js. */
    module.exports = {
      parse: parser.parse,
      parseLine: parser.parseLine,
      parseStrict: parser.parseStrict,
      parseLineStrict: parser.parseLineStrict,
      format: formatter.format,
      formatStrict: formatter.formatStrict,
      createLtsvToJsonStream: stream.createLtsvToJsonStream
    };

    /** export private functions if NODE_ENV variable is test. */
    if (isTest) {
      module.exports.parser_ = parser;
      module.exports.formatter_ = formatter;
      module.exports.validator_ = validator;
      module.exports.util_ = util;
    }
  } else {
    /** export functions for browser. */
    global.ltsv = {
      parse: parser.parse,
      parseLine: parser.parseLine,
      parseStrict: parser.parseStrict,
      parseLineStrict: parser.parseLineStrict,
      format: formatter.format,
      formatStrict: formatter.formatStrict
    };

    /** export private functions if declared Mocha. */
    if (isTest) {
      global.ltsv.parser_ = parser;
      global.ltsv.formatter_ = formatter;
      global.ltsv.validator_ = validator;
      global.ltsv.util_ = util;
    }
  }

}(this));
