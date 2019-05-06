import assert from 'assert';

import { createLtsvToJsonStream } from '../src/browser_stream.mjs';

/**
 * enqueue strings to TransformStream.
 *
 * @param {string[]} strings
 * @param {TransformStreamDefaultController} controller
 */
function enqueue(strings, controller) {
  setTimeout(function() {
    if (strings.length <= 0) {
      controller.close();
    } else {
      controller.enqueue(strings[0]);
      enqueue(strings.slice(1), controller);
    }
  }, 0);
}

/**
 * create ReadableStream for test.
 *
 * @param {string[]} strings
 * @param {Object} overrides
 * @return {ReadableStream}
 */
function createReadableStream(strings, overrides) {
  const underlyingSink = Object.assign(
    {
      start(controller) {
        enqueue(strings, controller);
      }
    },
    overrides
  );

  return new ReadableStream(underlyingSink);
}

/**
 * create WritableStream for test.
 *
 * @param {string[]} chunks
 * @param {Object} overrides
 * @return {WritableStream}
 */
function createWritableStream(chunks, overrides) {
  const underlyingSink = Object.assign(
    {
      write(chunk) {
        chunks.push(chunk);
      }
    },
    overrides
  );

  return new WritableStream(underlyingSink);
}

describe('browser_stream', function() {
  before(function() {
    if (
      typeof ReadableStream === 'undefined' ||
      typeof WritableStream === 'undefined' ||
      typeof TransformStream === 'undefined'
    ) {
      this.skip();
    }
  });

  it('should convert to JSON from LTSV', function() {
    return new Promise(function(resolve, reject) {
      const chunks = [];

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

  it('should convert to JSON if LTSV has empty line of end', function() {
    return new Promise(function(resolve, reject) {
      const chunks = [];

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

  it('should throw error if illegal LTSV', function() {
    return new Promise(function(resolve, reject) {
      const transformStream = createLtsvToJsonStream();
      const readableStream = createReadableStream(['\t']);
      const writableStream = createWritableStream([], {
        abort(reason) {
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

  describe('objectMode', function() {
    it('should convert to Object from LTSV', function() {
      return new Promise(function(resolve, reject) {
        const chunks = [];

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

  describe('strict', function() {
    it('should throw error if LTSV has unasserted character', function() {
      return new Promise(function(resolve, reject) {
        const transformStream = createLtsvToJsonStream({ strict: true });
        const readableStream = createReadableStream(['+:']);
        const writableStream = createWritableStream([], {
          abort(reason) {
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
