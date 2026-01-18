import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { assert, describe, it } from 'vitest';
import { createLtsvToJsonStream } from '../src/nodejs_stream';
import type { LtsvRecord } from '../src/types';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('nodejs_stream', () => {
  describe('#write() and #end()', () => {
    it('should convert to JSON from LTSV', () =>
      new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        stream.on('readable', () => {
          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', () => {
          assert.deepStrictEqual(buffer, [
            '{"label1":"value1","label2":"value2"}',
            '{"label3":"value3","label4":"value4"}'
          ]);
          resolve();
        });

        stream.write('label1:value1\tlabel2:value2');
        stream.end('\nlabel3:value3\tlabel4:value4');
      }));

    it('should convert to JSON if LTSV has empty line of end', () =>
      new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        stream.on('readable', () => {
          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', () => {
          assert.deepStrictEqual(buffer, [
            '{"label1":"value1","label2":"value2"}',
            '{"label3":"value3","label4":"value4"}'
          ]);
          resolve();
        });

        stream.write('label1:value1\tlabel2:value2');
        stream.end('\nlabel3:value3\tlabel4:value4\n');
      }));

    it('should throw error if illegal LTSV', () =>
      new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();

        stream.once('error', (err) => {
          assert(err !== null);
          resolve();
        });

        stream.end('\t');
      }));

    describe('objectMode mode', () => {
      it('should convert to Object from LTSV', () =>
        new Promise<void>((resolve) => {
          const stream = createLtsvToJsonStream({ objectMode: true });
          const buffer: LtsvRecord[] = [];

          stream.on('readable', () => {
            for (let buf = stream.read(); buf != null; buf = stream.read()) {
              buffer.push(buf);
            }
          });
          stream.once('end', () => {
            assert.deepStrictEqual(buffer, [
              { label1: 'value1', label2: 'value2' },
              { label3: 'value3', label4: 'value4' }
            ]);
            resolve();
          });

          stream.write('label1:value1\tlabel2:value2');
          stream.end('\nlabel3:value3\tlabel4:value4');
        }));
    });

    describe('isStrict mode', () => {
      it('should throw error if LTSV has unasserted character', () =>
        new Promise<void>((resolve) => {
          const stream = createLtsvToJsonStream({ strict: true });

          stream.once('error', (err) => {
            assert(err !== null);
            resolve();
          });

          stream.end('+:');
        }));
    });
  });

  describe('#pipe()', () => {
    it('should convert LTSV log of 1 line', () =>
      new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        if (stream === null) {
          return assert.fail();
        }

        stream.on('readable', () => {
          if (stream === null) {
            return;
          }

          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', () => {
          assert.deepStrictEqual(buffer, [
            '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
          ]);
          resolve();
        });

        fs.createReadStream(path.join(__dirname, './log/valid-1.ltsv')).pipe(
          stream
        );
      }));

    it('should convert LTSV log of 3 line', () =>
      new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        stream.on('readable', () => {
          if (stream === null) {
            return;
          }
          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', () => {
          assert.deepStrictEqual(buffer, [
            '{"aaa":"bbb","ccc":"ddd","eee":"fff"}',
            '{"aaa":"bbb","ccc":"ddd","eee":"fff"}',
            '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
          ]);
          resolve();
        });

        fs.createReadStream(path.join(__dirname, './log/valid-3.ltsv')).pipe(
          stream
        );
      }));

    it('should throw error if invalid LTSV log', () =>
      new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();

        // XXX: why fail when use stream.once?
        stream.on('error', (err) => {
          assert(err !== null);
          resolve();
        });

        fs.createReadStream(path.join(__dirname, './log/invalid.ltsv')).pipe(
          stream
        );
      }));
  });
});
