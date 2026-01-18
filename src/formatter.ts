import { isValidLabel, isValidValue } from './validator';

import type { LtsvRecord } from './types';

export type StringifyOptions = {
  strict: boolean;
};

/**
 * convert to record string from object
 *
 * @private
 * @param record
 * @param strict
 * @throws {TypeError}
 */
function objectToRecord(record: LtsvRecord, strict: boolean): string {
  if (record === null || typeof record !== 'object') {
    throw new TypeError('record must be an Object');
  }

  const keys = Object.keys(record);
  const fields = [];

  for (let i = 0, len = keys.length; i < len; ++i) {
    const label = keys[i];

    if (!label) {
      throw new TypeError('label must be a non-empty string');
    }

    const value = record[label];

    if (!value) {
      throw new TypeError('value must be a non-empty string');
    }

    if (strict && !isValidLabel(label)) {
      throw new SyntaxError(`unexpected character in label: "${label}"`);
    }

    if (strict && !isValidValue(value)) {
      throw new SyntaxError(`unexpected character in value: "${value}"`);
    }

    fields[i] = label + ':' + value;
  }

  return fields.join('\t');
}

/**
 * convert to LTSV string from object or array
 *
 * @private
 * @param data
 * @param strict
 * @throws {TypeError}
 */
function baseFormat(data: LtsvRecord | LtsvRecord[], strict: boolean): string {
  const isArray = Array.isArray(data);

  if (!isArray && (data === null || typeof data !== 'object')) {
    throw new TypeError('data must be an Object or Array');
  }

  const records: string[] = [];

  if (isArray) {
    for (let i = 0, len = data.length; i < len; ++i) {
      const record = data[i];

      if (!record) {
        throw new TypeError('record must be an Object');
      }

      records[i] = objectToRecord(record, strict);
    }
  } else {
    records.push(objectToRecord(data as LtsvRecord, strict));
  }

  return records.join('\n');
}

/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @see baseFormat
 */
export function format(data: LtsvRecord | LtsvRecord[]): string {
  return baseFormat(data, false);
}

/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @see baseFormat
 */
export function formatStrict(data: LtsvRecord | LtsvRecord[]): string {
  return baseFormat(data, true);
}

/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @param options
 * @see baseFormat
 */
export function stringify(
  data: LtsvRecord | LtsvRecord[],
  options: StringifyOptions = { strict: false }
): string {
  const { strict = false } = options;

  return baseFormat(data, strict);
}
