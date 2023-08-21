import { LtsvRecord } from './types';
export type LtsvToJsonStreamOptions = {
    objectMode?: boolean;
    strict?: boolean;
};
/**
 * LTSV to JSON transform stream
 *
 * @param options
 */
export declare function LtsvToJsonStream(options?: LtsvToJsonStreamOptions): Transformer<string, string | LtsvRecord>;
export declare function createLtsvToJsonStream(options?: LtsvToJsonStreamOptions): TransformStream<string, string | LtsvRecord>;
