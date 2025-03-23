import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { assert, describe, it } from 'vitest';
import { createLtsvToJsonStream } from '../src/nodejs_stream';
import { type LtsvRecord } from '../src/types';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('nodejs_stream', function () {
  describe('#write() and #end()', function () {
    it('should convert to JSON from LTSV', function () {
      return new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        stream.on('readable', function () {
          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', function () {
          assert.deepStrictEqual(buffer, [
            '{"label1":"value1","label2":"value2"}',
            '{"label3":"value3","label4":"value4"}'
          ]);
          resolve();
        });

        stream.write('label1:value1\tlabel2:value2');
        stream.end('\nlabel3:value3\tlabel4:value4');
      });
    });

    it('should convert to JSON if LTSV has empty line of end', function () {
      return new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        stream.on('readable', function () {
          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', function () {
          assert.deepStrictEqual(buffer, [
            '{"label1":"value1","label2":"value2"}',
            '{"label3":"value3","label4":"value4"}'
          ]);
          resolve();
        });

        stream.write('label1:value1\tlabel2:value2');
        stream.end('\nlabel3:value3\tlabel4:value4\n');
      });
    });

    it('should throw error if illegal LTSV', function () {
      return new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();

        stream.once('error', function (err) {
          assert(err !== null);
          resolve();
        });

        stream.end('\t');
      });
    });

    describe('objectMode mode', function () {
      it('should convert to Object from LTSV', function () {
        return new Promise<void>((resolve) => {
          const stream = createLtsvToJsonStream({ objectMode: true });
          const buffer: LtsvRecord[] = [];

          stream.on('readable', function () {
            for (let buf = stream.read(); buf != null; buf = stream.read()) {
              buffer.push(buf);
            }
          });
          stream.once('end', function () {
            assert.deepStrictEqual(buffer, [
              { label1: 'value1', label2: 'value2' },
              { label3: 'value3', label4: 'value4' }
            ]);
            resolve();
          });

          stream.write('label1:value1\tlabel2:value2');
          stream.end('\nlabel3:value3\tlabel4:value4');
        });
      });
    });

    describe('isStrict mode', function () {
      it('should throw error if LTSV has unasserted character', function () {
        return new Promise<void>((resolve) => {
          const stream = createLtsvToJsonStream({ strict: true });

          stream.once('error', function (err) {
            assert(err !== null);
            resolve();
          });

          stream.end('+:');
        });
      });
    });
  });

  describe('#pipe()', function () {
    it('should convert LTSV log of 1 line', function () {
      return new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        if (stream === null) {
          return assert.fail();
        }

        stream.on('readable', function () {
          if (stream === null) {
            return;
          }

          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', function () {
          assert.deepStrictEqual(buffer, [
            '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
          ]);
          resolve();
        });

        fs.createReadStream(path.join(__dirname, './log/valid-1.ltsv')).pipe(
          stream
        );
      });
    });

    it('should convert LTSV log of 3 line', function () {
      return new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();
        const buffer: string[] = [];

        stream.on('readable', function () {
          if (stream === null) {
            return;
          }
          for (let buf = stream.read(); buf != null; buf = stream.read()) {
            buffer.push(buf);
          }
        });
        stream.once('end', function () {
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
      });
    });

    it('should throw error if invalid LTSV log', function () {
      return new Promise<void>((resolve) => {
        const stream = createLtsvToJsonStream();

        // XXX: why fail when use stream.once?
        stream.on('error', function (err) {
          assert(err !== null);
          resolve();
        });

        fs.createReadStream(path.join(__dirname, './log/invalid.ltsv')).pipe(
          stream
        );
      });
    });
  });
});
