/**
 * @file LTSV to JSON transform stream for the browser.
 */

import { parseLine, parseLineStrict } from './parser.mjs';

function push(text, isFlush) {}

/**
 * LTSV to JSON transform stream.
 *
 * @param {Object} [options={}]
 * @param {Object} [options.objectMode=true]
 * @param {Object} [options.strict=false]
 * @return {Object}
 */
export function LtsvToJsonStream(options = {}) {
  const { objectMode = false, strict = false } = options;

  const parse = strict ? parseLineStrict : parseLine;
  const buffer = '';

  return {
    /**
     *
     * @param {string} chunk
     * @param {TransformStreamDefaultController} controller
     */
    transform(chunk, controller) {
      controller.enqueue();
      controller.error();
    },
    /**
     *
     * @param {TransformStreamDefaultController} controller
     */
    flush(controller) {
      controller.enqueue();
    }
  };
}

export function createLtsvToJsonStream(options) {
  return new TransformStream(LtsvToJsonStream(options));
}
