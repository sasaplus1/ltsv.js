import { isValidLabel, isValidValue } from './validator';

import { LtsvRecord } from './types';

type LtsvField = {
  label: string;
  value: string;
};

/**
 * split to label and value from field
 *
 * @private
 * @param chunk
 * @param strict
 * @throws {SyntaxError}
 */
function splitField(chunk: string, strict: boolean): LtsvField {
  const field = String(chunk);
  const index = field.indexOf(':');

  if (index === -1) {
    throw new SyntaxError(`field separator is not found: "${field}"`);
  }

  const label = field.slice(0, index);
  const value = field.slice(index + 1);

  if (strict && !isValidLabel(label)) {
    throw new SyntaxError(`unexpected character in label: "${label}"`);
  }

  if (strict && !isValidValue(value)) {
    throw new SyntaxError(`unexpected character in value: "${value}"`);
  }

  return {
    label,
    value
  };
}

/**
 * parse LTSV record
 *
 * @private
 * @param line
 * @param strict
 */
function baseParseLine(line: string, strict: boolean): LtsvRecord {
  const fields = String(line)
    .replace(/(?:\r?\n)+$/, '')
    .split('\t');

  const record: LtsvRecord = {};

  for (let i = 0, len = fields.length; i < len; ++i) {
    const { label, value } = splitField(fields[i], strict);

    record[label] = value;
  }

  return record;
}

/**
 * parse LTSV text
 *
 * @private
 * @param text
 * @param strict
 */
function baseParse(text: string, strict: boolean): LtsvRecord[] {
  const lines = String(text)
    .replace(/(?:\r?\n)+$/, '')
    .split(/\r?\n/);

  const records: LtsvRecord[] = [];

  for (let i = 0, len = lines.length; i < len; ++i) {
    records[i] = baseParseLine(lines[i], strict);
  }

  return records;
}

/**
 * parse LTSV text
 *
 * @param text
 */
export function parse(text: string): LtsvRecord[] {
  return baseParse(text, false);
}

/**
 * parse LTSV record
 *
 * @param line
 */
export function parseLine(line: string): LtsvRecord {
  return baseParseLine(line, false);
}

/**
 * parse LTSV text
 *
 * @param text
 */
export function parseStrict(text: string): LtsvRecord[] {
  return baseParse(text, true);
}

/**
 * parse LTSV record
 *
 * @param line
 */
export function parseLineStrict(line: string): LtsvRecord {
  return baseParseLine(line, true);
}
