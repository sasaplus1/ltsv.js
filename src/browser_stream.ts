/**
 * @file LTSV to JSON transform stream for the browser.
 */

import { parseLine, parseLineStrict } from './parser.mjs';

/**
 * transform and push to stream.
 *
 * @param {string} text
 * @param {boolean} isFlush
 * @param {TransformStreamDefaultController} controller
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
 * LTSV to JSON transform stream.
 *
 * @param {Object} [options={}]
 * @param {Object} [options.objectMode=false]
 * @param {Object} [options.strict=false]
 * @return {Object}
 */
export function LtsvToJsonStream(options = {}) {
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
     * @param {string} chunk
     * @param {TransformStreamDefaultController} controller
     */
    transform(chunk, controller) {
      push.call(instance, instance.buffer + chunk, false, controller);
    },
    /**
     * flush implementation.
     *
     * @param {TransformStreamDefaultController} controller
     */
    flush(controller) {
      push.call(instance, instance.buffer, true, controller);
    }
  };
}

export function createLtsvToJsonStream(options) {
  return new TransformStream(LtsvToJsonStream(options));
}
