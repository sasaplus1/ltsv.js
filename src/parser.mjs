/**
 * @file LTSV parser.
 */

import { isValidLabel, isValidValue } from './validator.mjs';

/**
 * split to label and value from field.
 *
 * @private
 * @param {string} chunk
 * @param {boolean} strict
 * @return {Object}
 * @throws {SyntaxError}
 */
function splitField(chunk, strict) {
  const field = String(chunk);
  const index = field.indexOf(':');

  if (index === -1) {
    throw new SyntaxError(`field separator is not found: "${field}"`);
  }

  const label = field.slice(0, index);
  const value = field.slice(index + 1);

  if (strict && !isValidLabel(label)) {
    throw new SyntaxError(`unexpected character of label: "${label}"`);
  }

  if (strict && !isValidValue(value)) {
    throw new SyntaxError(`unexpected character of value: "${value}"`);
  }

  return {
    label,
    value
  };
}

/**
 * parse LTSV text.
 *
 * @private
 * @param {string} text
 * @param {boolean} strict
 * @return {Object[]}
 */
function baseParse(text, strict) {
  const lines = String(text)
    .replace(/(?:\r?\n)+$/, '')
    .split(/\r?\n/);

  const records = [];

  for (let i = 0, len = lines.length; i < len; ++i) {
    records[i] = baseParseLine(lines[i], strict);
  }

  return records;
}

/**
 * parse LTSV record.
 *
 * @private
 * @param {string} line
 * @param {boolean} strict
 * @return {Object}
 */
function baseParseLine(line, strict) {
  const fields = String(line)
    .replace(/(?:\r?\n)+$/, '')
    .split('\t');

  const record = {};

  for (let i = 0, len = fields.length; i < len; ++i) {
    const { label, value } = splitField(fields[i], strict);

    record[label] = value;
  }

  return record;
}

/**
 * parse LTSV text.
 *
 * @param {string} text
 * @return {string}
 */
export function parse(text) {
  return baseParse(text, false);
}

/**
 * parse LTSV record.
 *
 * @param {string} line
 * @return {string}
 */
export function parseLine(line) {
  return baseParseLine(line, false);
}

/**
 * parse LTSV text.
 *
 * @param {string} text
 * @return {string}
 */
export function parseStrict(text) {
  return baseParse(text, true);
}

/**
 * parse LTSV record.
 *
 * @param {string} line
 * @return {string}
 */
export function parseLineStrict(line) {
  return baseParseLine(line, true);
}
