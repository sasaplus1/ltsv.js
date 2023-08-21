/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Transform, TransformCallback } from 'stream';
import { StringDecoder } from 'string_decoder';
import { parseLine, parseLineStrict } from './parser';
export type LtsvToJsonStreamOptions = {
    encoding?: string;
    objectMode?: boolean;
    strict?: boolean;
};
/**
 * LTSV to JSON transform stream
 */
export declare class LtsvToJsonStream extends Transform {
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
    constructor(options?: LtsvToJsonStreamOptions);
    /**
     * transform and push to stream.
     *
     * @private
     * @param text
     * @param isFlush
     * @param callback
     */
    _push(text: string, isFlush: boolean, callback: TransformCallback): void;
    /**
     * _transform implementation.
     *
     * @private
     * @param chunk
     * @param encoding
     * @param callback
     */
    _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void;
    /**
     * _flush implementation.
     *
     * @private
     * @param callback
     */
    _flush(callback: TransformCallback): void;
}
/**
 * create LtsvToJsonStream instance.
 *
 * @param options
 * @see LtsvToJsonStream
 */
export declare function createLtsvToJsonStream(options?: LtsvToJsonStreamOptions): LtsvToJsonStream;
