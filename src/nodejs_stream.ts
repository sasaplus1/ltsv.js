import { Transform, type TransformCallback } from 'stream';
import { StringDecoder } from 'string_decoder';

import { parseLine, parseLineStrict } from './parser';
import type { LtsvRecord } from './types';

export type LtsvToJsonStreamOptions = {
  encoding?: BufferEncoding;
  objectMode?: boolean;
  strict?: boolean;
};

/**
 * LTSV to JSON transform stream
 */
export class LtsvToJsonStream extends Transform {
  /**
   * chunk buffer
   */
  buffer: string;
  /**
   * for decode chunks
   */
  decoder: StringDecoder;
  /**
   * if true, pass object to next stream
   */
  objectMode: boolean;
  /**
   * parser function
   */
  parse: typeof parseLine | typeof parseLineStrict;

  /**
   * constructor
   *
   * @param options
   */
  constructor(
    options: LtsvToJsonStreamOptions = {
      encoding: 'utf8',
      objectMode: false,
      strict: false
    }
  ) {
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
   * @param text
   * @param isFlush
   * @param callback
   */
  _push(text: string, isFlush: boolean, callback: TransformCallback): void {
    let next = 0;
    let last = 0;
    let error: Error | null = null;

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

      let record: LtsvRecord = {};

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
   * @param chunk
   * @param encoding
   * @param callback
   */
  override _transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chunk: any,
    _encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this._push(this.buffer + this.decoder.write(chunk), false, callback);
  }

  /**
   * _flush implementation.
   *
   * @private
   * @param callback
   */
  override _flush(callback: TransformCallback): void {
    this._push(this.buffer + this.decoder.end(), true, callback);
  }
}

/**
 * create LtsvToJsonStream instance.
 *
 * @param options
 * @see LtsvToJsonStream
 */
export function createLtsvToJsonStream(
  options?: LtsvToJsonStreamOptions
): LtsvToJsonStream {
  return new LtsvToJsonStream(options);
}
