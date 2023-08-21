import { Transform } from 'stream';
import { StringDecoder } from 'string_decoder';

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
 * split to label and value from field
 *
 * @private
 * @param chunk
 * @param strict
 * @throws {SyntaxError}
 * @throws {TypeError}
 */
function splitField(chunk, strict) {
  if (chunk === undefined) {
    throw new TypeError('chunk is undefined');
  }
  const index = chunk.indexOf(':');
  if (index === -1) {
    throw new SyntaxError(`field separator is not found: "${chunk}"`);
  }
  const label = chunk.slice(0, index);
  const value = chunk.slice(index + 1);
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
  const fields = String(line).replace(/(?:\r?\n)+$/, '').split('\t');
  const record = {};
  for (let i = 0, len = fields.length; i < len; ++i) {
    const {
      label,
      value
    } = splitField(fields[i], strict);
    record[label] = value;
  }
  return record;
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
 * parse LTSV record
 *
 * @param line
 */
function parseLineStrict(line) {
  return baseParseLine(line, true);
}

/**
 * LTSV to JSON transform stream
 */
class LtsvToJsonStream extends Transform {
  /**
   * constructor
   *
   * @param options
   */
  constructor(options = {
    encoding: 'utf8',
    objectMode: false,
    strict: false
  }) {
    super({
      ...options,
      decodeStrings: true,
      objectMode: true
    });
    /**
     * chunk buffer
     */
    this.buffer = void 0;
    /**
     * for decode chunks
     */
    this.decoder = void 0;
    /**
     * if true, pass object to next stream
     */
    this.objectMode = void 0;
    /**
     * parser function
     */
    this.parse = void 0;
    const {
      encoding = 'utf8',
      objectMode = false,
      strict = false
    } = options;
    this.objectMode = objectMode;
    this.parse = strict ? parseLineStrict : parseLine;
    this.buffer = '';
    this.decoder = new StringDecoder(encoding);
  }
  /**
   * transform and push to stream.
   *
   * @private
   * @param text
   * @param isFlush
   * @param callback
   */
  _push(text, isFlush, callback) {
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
        } else {
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
      } catch (e) {
        if (e instanceof Error) {
          error = e;
        }
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
   * @param chunk
   * @param encoding
   * @param callback
   */
  _transform(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chunk, _encoding, callback) {
    this._push(this.buffer + this.decoder.write(chunk), false, callback);
  }
  /**
   * _flush implementation.
   *
   * @private
   * @param callback
   */
  _flush(callback) {
    this._push(this.buffer + this.decoder.end(), true, callback);
  }
}
/**
 * create LtsvToJsonStream instance.
 *
 * @param options
 * @see LtsvToJsonStream
 */
function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options);
}

export { LtsvToJsonStream, createLtsvToJsonStream };
//# sourceMappingURL=ltsv.module.mjs.map
