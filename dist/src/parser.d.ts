import { LtsvRecord } from './types';
/**
 * parse LTSV text
 *
 * @param text
 */
export declare function parse(text: string): LtsvRecord[];
/**
 * parse LTSV record
 *
 * @param line
 */
export declare function parseLine(line: string): LtsvRecord;
/**
 * parse LTSV text
 *
 * @param text
 */
export declare function parseStrict(text: string): LtsvRecord[];
/**
 * parse LTSV record
 *
 * @param line
 */
export declare function parseLineStrict(line: string): LtsvRecord;
