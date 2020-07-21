import assert = require('assert');
import * as fs from 'fs';

import { createLtsvToJsonStream } from '../src/nodejs_stream';

describe('nodejs_stream', function () {
  describe('#write() and #end()', function () {
    it('should convert to JSON from LTSV', function (done) {
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
        done();
      });

      stream.write('label1:value1\tlabel2:value2');
      stream.end('\nlabel3:value3\tlabel4:value4');
    });

    it('should convert to JSON if LTSV has empty line of end', function (done) {
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
        done();
      });

      stream.write('label1:value1\tlabel2:value2');
      stream.end('\nlabel3:value3\tlabel4:value4\n');
    });

    it('should throw error if illegal LTSV', function (done) {
      const stream = createLtsvToJsonStream();

      stream.once('error', function (err) {
        assert(err !== null);
        done();
      });

      stream.end('\t');
    });

    describe('objectMode mode', function () {
      it('should convert to Object from LTSV', function (done) {
        const stream = createLtsvToJsonStream({ objectMode: true });
        const buffer: string[] = [];

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
          done();
        });

        stream.write('label1:value1\tlabel2:value2');
        stream.end('\nlabel3:value3\tlabel4:value4');
      });
    });

    describe('isStrict mode', function () {
      it('should throw error if LTSV has unasserted character', function (done) {
        const stream = createLtsvToJsonStream({ strict: true });

        stream.once('error', function (err) {
          assert(err !== null);
          done();
        });

        stream.end('+:');
      });
    });
  });

  describe('#pipe()', function () {
    it('should convert LTSV log of 1 line', function (done) {
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
        done();
      });

      fs.createReadStream(require.resolve('./log/valid-1.ltsv')).pipe(stream);
    });

    it('should convert LTSV log of 3 line', function (done) {
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
        done();
      });

      fs.createReadStream(require.resolve('./log/valid-3.ltsv')).pipe(stream);
    });

    it('should throw error if invalid LTSV log', function (done) {
      const stream = createLtsvToJsonStream();

      // XXX: why fail when use stream.once?
      stream.on('error', function (err) {
        assert(err !== null);
        done();
      });

      fs.createReadStream(require.resolve('./log/invalid.ltsv')).pipe(stream);
    });
  });
});
