"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLtsvToJsonStream = createLtsvToJsonStream;
exports.LtsvToJsonStream = void 0;

var _stream = require("stream");

var _string_decoder = require("string_decoder");

var _parser = require("./parser.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * LTSV to JSON transform stream.
 */
class LtsvToJsonStream extends _stream.Transform {
  /**
   * constructor.
   *
   * @param {Object} options
   * @param {string} options.encoding
   * @param {boolean} options.objectMode
   * @param {boolean} options.strict
   */
  constructor(options = {}) {
    super(_objectSpread({}, options, {
      decodeStrings: true,
      objectMode: true
    }));
    const _options$encoding = options.encoding,
          encoding = _options$encoding === void 0 ? 'utf8' : _options$encoding,
          _options$objectMode = options.objectMode,
          objectMode = _options$objectMode === void 0 ? false : _options$objectMode,
          _options$strict = options.strict,
          strict = _options$strict === void 0 ? false : _options$strict;
    this.objectMode = objectMode;
    this.parse = strict ? _parser.parseLineStrict : _parser.parseLine;
    this.buffer = '';
    this.decoder = new _string_decoder.StringDecoder(encoding);
  }
  /**
   * transform and push to stream.
   *
   * @private
   * @param {string} text
   * @param {boolean} isFlush
   * @param {Function} callback
   */


  _push(text, isFlush, callback) {
    let next = 0;
    let last = 0;
    let error = null; // eslint-disable-next-line no-constant-condition

    while (true) {
      let index = text.indexOf('\n', next);

      if (index === -1) {
        if (isFlush && next < text.length) {
          // NOTE: subtract 1 from text.length,
          // NOTE: because add 1 to index when slice.
          index = text.length - 1;
        } else {
          break;
        }
      } // NOTE: include `\n`.
      // NOTE: foo:foo\tbar:bar\nfoo:foo\tbar:bar\n
      // NOTE: -----------------|


      const line = text.slice(next, index + 1);
      let record;

      try {
        record = this.parse(line);
      } catch (e) {
        error = e;
      }

      if (error) {
        break;
      }

      const result = this.push(this.objectMode ? record : JSON.stringify(record));

      if (result) {
        // NOTE: save next start index.
        // NOTE: foo:foo\tbar:bar\nfoo:foo\tbar:bar\n
        // NOTE: ------------------|
        last = next = index + 1;
      } else {
        break;
      }
    }

    this.buffer = text.slice(last);
    callback(error);
  }
  /**
   * _transform implementation.
   *
   * @private
   * @param {Buffer|string|*} chunk
   * @param {string} encoding
   * @param {Function} callback
   */


  _transform(chunk, encoding, callback) {
    this._push(this.buffer + this.decoder.write(chunk), false, callback);
  }
  /**
   * _flush implementation.
   *
   * @private
   * @param {Function} callback
   */


  _flush(callback) {
    this._push(this.buffer + this.decoder.end(), true, callback);
  }

}
/**
 * create LtsvToJsonStream instance.
 *
 * @param {Object} options
 * @return {LtsvToJsonStream}
 * @see LtsvToJsonStream
 */


exports.LtsvToJsonStream = LtsvToJsonStream;

function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options);
}
//# sourceMappingURL=stream.js.map