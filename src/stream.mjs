import { Transform } from 'stream';
import { StringDecoder } from 'string_decoder';

import { parseLine, parseLineStrict } from './parser.mjs';

/**
 * LTSV to JSON transform stream.
 */
export class LtsvToJsonStream extends Transform {
  /**
   * constructor.
   *
   * @param {Object} options
   * @param {string} options.encoding
   * @param {boolean} options.objectMode
   * @param {boolean} options.strict
   */
  constructor(options = {}) {
    super({
      ...options,
      decodeStrings: true,
      objectMode: true
    });

    const { encoding = 'utf8', objectMode = false, strict = false } = options;

    this.objectMode = objectMode;
    this.parse = strict ? parseLineStrict : parseLine;

    this.buffer = '';
    this.decoder = new StringDecoder(encoding);
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

      let record;

      try {
        record = this.parse(line);
      } catch (e) {
        error = e;
      }

      if (error) {
        break;
      }

      const result = this.push(
        this.objectMode ? record : JSON.stringify(record)
      );

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
export function createLtsvToJsonStream(options) {
  return new LtsvToJsonStream(options);
}
