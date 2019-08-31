import {
  TransformStream,
  TransformStreamDefaultController,
  TransformStreamTransformer
} from 'whatwg-streams';

import { parseLine, parseLineStrict } from './parser';
import { LtsvRecord } from './types';

export type LtsvToJsonStreamOptions = {
  objectMode: boolean;
  strict: boolean;
};

type LtsvToJsonStreamInstance = {
  buffer: string;
  objectMode: boolean;
  parse: typeof parseLine | typeof parseLineStrict;
};

/**
 * transform and push to stream
 *
 * @param text
 * @param isFlush
 * @param controller
 */
function push(
  this: LtsvToJsonStreamInstance,
  text: string,
  isFlush: boolean,
  controller: TransformStreamDefaultController<string | LtsvRecord>
): void {
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
export function LtsvToJsonStream(
  options: LtsvToJsonStreamOptions = {
    objectMode: false,
    strict: false
  }
): TransformStreamTransformer<string | LtsvRecord, string> {
  const { objectMode = false, strict = false } = options;

  const instance: LtsvToJsonStreamInstance = {
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
    transform(
      chunk: string,
      controller: TransformStreamDefaultController<string | LtsvRecord>
    ): void {
      push.call(instance, instance.buffer + chunk, false, controller);
    },
    /**
     * flush implementation.
     *
     * @param {TransformStreamDefaultController} controller
     */
    flush(
      controller: TransformStreamDefaultController<string | LtsvRecord>
    ): void {
      push.call(instance, instance.buffer, true, controller);
    }
  };
}

export function createLtsvToJsonStream(
  options: LtsvToJsonStreamOptions
): TransformStream<string | LtsvRecord, string> {
  return new TransformStream(LtsvToJsonStream(options));
}
