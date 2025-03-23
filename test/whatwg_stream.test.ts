import { assert, describe, it } from 'vitest';

import { createLtsvToJsonStream } from '../src/whatwg_stream';

/**
 * enqueue strings to TransformStream
 *
 * @param strings
 * @param controller
 */
function enqueue(
  strings: string[],
  controller: ReadableStreamDefaultController<string>
): void {
  setTimeout(function () {
    if (strings.length <= 0) {
      controller.close();
    } else {
      controller.enqueue(strings[0]);
      enqueue(strings.slice(1), controller);
    }
  }, 0);
}

/**
 * create ReadableStream for test
 *
 * @param strings
 * @param overrides
 */
function createReadableStream(
  strings: string[],
  overrides: UnderlyingSource<string> = {}
): ReadableStream {
  const underlyingSink: UnderlyingSource<string> = {
    start(controller): void {
      enqueue(strings, controller);
    },
    ...overrides
  };

  return new ReadableStream<string>(underlyingSink);
}

/**
 * create WritableStream for test.
 *
 * @param {string[]} chunks
 * @param {Object} overrides
 * @return {WritableStream}
 */
function createWritableStream(
  chunks: string[],
  overrides: UnderlyingSink<string> = {}
): WritableStream {
  const underlyingSink: UnderlyingSink<string> = {
    write(chunk): void {
      chunks.push(chunk);
    },
    ...overrides
  };

  return new WritableStream<string>(underlyingSink);
}

const hasnotWhatwgStreams =
  typeof ReadableStream === 'undefined' ||
  typeof WritableStream === 'undefined' ||
  typeof TransformStream === 'undefined';

describe.skipIf(hasnotWhatwgStreams)('whatwg_stream', function () {
  it('should convert to JSON from LTSV', function () {
    return new Promise<void>(function (
      resolve: () => void,
      reject: (reason?: Error | null) => void
    ): void {
      const chunks: string[] = [];

      const transformStream = createLtsvToJsonStream();
      const readableStream = createReadableStream([
        'label1:value1\tlabel2:value2\n',
        'label3:value3\tlabel4:value4'
      ]);
      const writableStream = createWritableStream(chunks, {
        abort: reject,
        close() {
          assert.deepStrictEqual(chunks, [
            '{"label1":"value1","label2":"value2"}',
            '{"label3":"value3","label4":"value4"}'
          ]);
          resolve();
        }
      });

      readableStream.pipeThrough(transformStream).pipeTo(writableStream);
    });
  });

  it('should convert to JSON if LTSV has empty line of end', function () {
    return new Promise<void>(function (
      resolve: () => void,
      reject: (reason?: Error | null) => void
    ): void {
      const chunks: string[] = [];

      const transformStream = createLtsvToJsonStream();
      const readableStream = createReadableStream([
        'label1:value1\tlabel2:value2\n',
        'label3:value3\tlabel4:value4\n'
      ]);
      const writableStream = createWritableStream(chunks, {
        abort: reject,
        close() {
          assert.deepStrictEqual(chunks, [
            '{"label1":"value1","label2":"value2"}',
            '{"label3":"value3","label4":"value4"}'
          ]);
          resolve();
        }
      });

      readableStream.pipeThrough(transformStream).pipeTo(writableStream);
    });
  });

  it('should throw error if illegal LTSV', function () {
    return new Promise<void>(function (
      resolve: () => void,
      reject: (reason?: Error | null) => void
    ): void {
      const transformStream = createLtsvToJsonStream();
      const readableStream = createReadableStream(['\t']);
      const writableStream = createWritableStream([], {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abort(reason: any) {
          assert(reason !== null);
          resolve();
        },
        close() {
          reject(new Error('close'));
        }
      });

      readableStream.pipeThrough(transformStream).pipeTo(writableStream);
    });
  });

  describe('objectMode', function () {
    it('should convert to Object from LTSV', function () {
      return new Promise<void>(function (
        resolve: () => void,
        reject: (reason?: Error | null) => void
      ): void {
        const chunks: string[] = [];

        const transformStream = createLtsvToJsonStream({
          objectMode: true
        });
        const readableStream = createReadableStream([
          'label1:value1\tlabel2:value2\n',
          'label3:value3\tlabel4:value4'
        ]);
        const writableStream = createWritableStream(chunks, {
          abort: reject,
          close() {
            assert.deepStrictEqual(chunks, [
              { label1: 'value1', label2: 'value2' },
              { label3: 'value3', label4: 'value4' }
            ]);
            resolve();
          }
        });

        readableStream.pipeThrough(transformStream).pipeTo(writableStream);
      });
    });
  });

  describe('strict', function () {
    it('should throw error if LTSV has illegal character', function () {
      return new Promise<void>(function (
        resolve: () => void,
        reject: (reason?: Error | null) => void
      ): void {
        const transformStream = createLtsvToJsonStream({ strict: true });
        const readableStream = createReadableStream(['+:']);
        const writableStream = createWritableStream([], {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          abort(reason: any) {
            assert(reason !== null);
            resolve();
          },
          close() {
            reject(new Error('close'));
          }
        });

        readableStream.pipeThrough(transformStream).pipeTo(writableStream);
      });
    });
  });
});
