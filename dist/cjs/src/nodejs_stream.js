"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLtsvToJsonStream = exports.LtsvToJsonStream = void 0;
const stream_1 = require("stream");
const string_decoder_1 = require("string_decoder");
const parser_1 = require("./parser");
/**
 * LTSV to JSON transform stream
 */
class LtsvToJsonStream extends stream_1.Transform {
    /**
     * constructor
     *
     * @param options
     */
    constructor(options = {
        encoding: 'utf8',
        objectMode: false,
        strict: false
    }) {
        super({
            ...options,
            decodeStrings: true,
            objectMode: true
        });
        const { encoding = 'utf8', objectMode = false, strict = false } = options;
        this.objectMode = objectMode;
        this.parse = strict ? parser_1.parseLineStrict : parser_1.parseLine;
        this.buffer = '';
        this.decoder = new string_decoder_1.StringDecoder(encoding);
    }
    /**
     * transform and push to stream.
     *
     * @private
     * @param text
     * @param isFlush
     * @param callback
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
                }
                else {
                    break;
                }
            }
            // NOTE: include `\n`.
            // NOTE: foo:foo\tbar:bar\nfoo:foo\tbar:bar\n
            // NOTE: -----------------|
            const line = text.slice(next, index + 1);
            let record = {};
            try {
                record = this.parse(line);
            }
            catch (e) {
                error = e;
            }
            if (error) {
                break;
            }
            const result = this.push(this.objectMode ? record : JSON.stringify(record));
            if (result) {
                // NOTE: save next start index.
                // NOTE: foo:foo\tbar:bar\nfoo:foo\tbar:bar\n
                // NOTE: ------------------|
                last = next = index + 1;
            }
            else {
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
    _transform(chunk, encoding, callback) {
        this._push(this.buffer + this.decoder.write(chunk), false, callback);
    }
    /**
     * _flush implementation.
     *
     * @private
     * @param callback
     */
    _flush(callback) {
        this._push(this.buffer + this.decoder.end(), true, callback);
    }
}
exports.LtsvToJsonStream = LtsvToJsonStream;
/**
 * create LtsvToJsonStream instance.
 *
 * @param options
 * @see LtsvToJsonStream
 */
function createLtsvToJsonStream(options) {
    return new LtsvToJsonStream(options);
}
exports.createLtsvToJsonStream = createLtsvToJsonStream;
//# sourceMappingURL=nodejs_stream.js.map