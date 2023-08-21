import { LtsvRecord } from './types';
export type StringifyOptions = {
    strict: boolean;
};
/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @see baseFormat
 */
export declare function format(data: LtsvRecord | LtsvRecord[]): string;
/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @see baseFormat
 */
export declare function formatStrict(data: LtsvRecord | LtsvRecord[]): string;
/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @param options
 * @see baseFormat
 */
export declare function stringify(data: LtsvRecord | LtsvRecord[], options?: StringifyOptions): string;
