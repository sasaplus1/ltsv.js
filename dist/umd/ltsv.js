/*!
 * @license ltsv.js Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv.js
 * Released under the MIT license.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.ltsv = {}));
}(this, function (exports) { 'use strict';

  /**
   * validate label
   *
   * @param label
   */
  function isValidLabel(label) {
      return /^[0-9A-Za-z_.-]+$/.test(label);
  }
  /**
   * validate for value
   *
   * @param value
   */
  function isValidValue(value) {
      // eslint-disable-next-line no-control-regex
      return /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/.test(value);
  }

  /**
   * convert to record string from object
   *
   * @private
   * @param record
   * @param strict
   * @throws {TypeError}
   */
  function objectToRecord(record, strict) {
      if (record === null || typeof record !== 'object') {
          throw new TypeError('record must be an Object');
      }
      const keys = Object.keys(record);
      const fields = [];
      for (let i = 0, len = keys.length; i < len; ++i) {
          const label = keys[i];
          const value = record[keys[i]];
          if (strict && !isValidLabel(label)) {
              throw new SyntaxError(`unexpected character in label: "${label}"`);
          }
          if (strict && !isValidValue(value)) {
              throw new SyntaxError(`unexpected character in value: "${value}"`);
          }
          fields[i] = label + ':' + value;
      }
      return fields.join('\t');
  }
  /**
   * convert to LTSV string from object or array
   *
   * @private
   * @param data
   * @param strict
   * @throws {TypeError}
   */
  function baseFormat(data, strict) {
      const isArray = Array.isArray(data);
      if (!isArray && (data === null || typeof data !== 'object')) {
          throw new TypeError('data must be an Object or Array');
      }
      const records = [];
      if (isArray) {
          for (let i = 0, len = data.length; i < len; ++i) {
              records[i] = objectToRecord(data[i], strict);
          }
      }
      else {
          records.push(objectToRecord(data, strict));
      }
      return records.join('\n');
  }
  /**
   * convert to LTSV string from object or array
   *
   * @param data
   * @see baseFormat
   */
  function format(data) {
      return baseFormat(data, false);
  }
  /**
   * convert to LTSV string from object or array
   *
   * @param data
   * @see baseFormat
   */
  function formatStrict(data) {
      return baseFormat(data, true);
  }
  /**
   * convert to LTSV string from object or array
   *
   * @param data
   * @param options
   * @see baseFormat
   */
  function stringify(data, options = { strict: false }) {
      const { strict = false } = options;
      return baseFormat(data, strict);
  }

  /**
   * split to label and value from field
   *
   * @private
   * @param chunk
   * @param strict
   * @throws {SyntaxError}
   */
  function splitField(chunk, strict) {
      const field = String(chunk);
      const index = field.indexOf(':');
      if (index === -1) {
          throw new SyntaxError(`field separator is not found: "${field}"`);
      }
      const label = field.slice(0, index);
      const value = field.slice(index + 1);
      if (strict && !isValidLabel(label)) {
          throw new SyntaxError(`unexpected character in label: "${label}"`);
      }
      if (strict && !isValidValue(value)) {
          throw new SyntaxError(`unexpected character in value: "${value}"`);
      }
      return {
          label,
          value
      };
  }
  /**
   * parse LTSV record
   *
   * @private
   * @param line
   * @param strict
   */
  function baseParseLine(line, strict) {
      const fields = String(line)
          .replace(/(?:\r?\n)+$/, '')
          .split('\t');
      const record = {};
      for (let i = 0, len = fields.length; i < len; ++i) {
          const { label, value } = splitField(fields[i], strict);
          record[label] = value;
      }
      return record;
  }
  /**
   * parse LTSV text
   *
   * @private
   * @param text
   * @param strict
   */
  function baseParse(text, strict) {
      const lines = String(text)
          .replace(/(?:\r?\n)+$/, '')
          .split(/\r?\n/);
      const records = [];
      for (let i = 0, len = lines.length; i < len; ++i) {
          records[i] = baseParseLine(lines[i], strict);
      }
      return records;
  }
  /**
   * parse LTSV text
   *
   * @param text
   */
  function parse(text) {
      return baseParse(text, false);
  }
  /**
   * parse LTSV record
   *
   * @param line
   */
  function parseLine(line) {
      return baseParseLine(line, false);
  }
  /**
   * parse LTSV text
   *
   * @param text
   */
  function parseStrict(text) {
      return baseParse(text, true);
  }
  /**
   * parse LTSV record
   *
   * @param line
   */
  function parseLineStrict(line) {
      return baseParseLine(line, true);
  }

  /**
   * transform and push to stream
   *
   * @param text
   * @param isFlush
   * @param controller
   */
  function push(text, isFlush, controller) {
      let next = 0;
      let last = 0;
      let error = null;
      // eslint-disable-next-line no-constant-condition
      while (true) {
          let index = text.indexOf('\n', next);
          if (index === -1) {
              if (isFlush && next < text.length) {
                  // NOTE: subtract 1 from text.length,
                  // NOTE: because add 1 to index when slice.
                  index = text.length - 1;
              }
              else {
                  break;
              }
          }
          // NOTE: include `\n`.
          // NOTE: foo:foo\tbar:bar\nfoo:foo\tbar:bar\n
          // NOTE: -----------------|
          const line = text.slice(next, index + 1);
          let record = {};
          try {
              record = this.parse(line);
          }
          catch (e) {
              error = e;
          }
          if (error) {
              break;
          }
          controller.enqueue(this.objectMode ? record : JSON.stringify(record));
          // NOTE: save next start index.
          // NOTE: foo:foo\tbar:bar\nfoo:foo\tbar:bar\n
          // NOTE: ------------------|
          last = next = index + 1;
      }
      this.buffer = text.slice(last);
      if (error) {
          controller.error(error);
      }
  }
  /**
   * LTSV to JSON transform stream
   *
   * @param options
   */
  function LtsvToJsonStream(options = {
      objectMode: false,
      strict: false
  }) {
      const { objectMode = false, strict = false } = options;
      const instance = {
          buffer: '',
          objectMode,
          parse: strict ? parseLineStrict : parseLine
      };
      return {
          /**
           * transform implementation.
           *
           * @param chunk
           * @param controller
           */
          transform(chunk, controller) {
              push.call(instance, instance.buffer + chunk, false, controller);
          },
          /**
           * flush implementation.
           *
           * @param controller
           */
          flush(controller) {
              push.call(instance, instance.buffer, true, controller);
          }
      };
  }
  function createLtsvToJsonStream(options) {
      return new TransformStream(LtsvToJsonStream(options));
  }

  exports.LtsvToJsonStream = LtsvToJsonStream;
  exports.createLtsvToJsonStream = createLtsvToJsonStream;
  exports.format = format;
  exports.formatStrict = formatStrict;
  exports.isValidLabel = isValidLabel;
  exports.isValidValue = isValidValue;
  exports.parse = parse;
  exports.parseLine = parseLine;
  exports.parseLineStrict = parseLineStrict;
  exports.parseStrict = parseStrict;
  exports.stringify = stringify;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ltsv.js.map
