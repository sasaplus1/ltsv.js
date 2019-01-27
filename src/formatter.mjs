/**
 * @file LTSV formatter.
 * @module formatter
 */

import { isValidLabel, isValidValue } from './validator.mjs';

/**
 * convert to record string from object.
 *
 * @private
 * @param {Object} object
 * @param {boolean} strict
 * @returns {string}
 * @throws {TypeError}
 */
function objectToRecord(object, strict) {
  if (object === null || typeof object !== 'object') {
    throw new TypeError('object must be an Object');
  }

  const keys = Object.keys(object);
  const fields = [];

  for (let i = 0, len = keys.length; i < len; ++i) {
    const label = keys[i];
    const value = object[keys[i]];

    if (strict && !isValidLabel(label)) {
      throw new SyntaxError(`unexpected character of label: "${label}"`);
    }

    if (strict && !isValidValue(value)) {
      throw new SyntaxError(`unexpected character of value: "${value}"`);
    }

    fields[i] = label + ':' + value;
  }

  return fields.join('\t');
}

/**
 * convert to LTSV string from object or array.
 *
 * @private
 * @param {Object|Object[]} data
 * @param {boolean} strict
 * @returns {string}
 * @throws {TypeError}
 */
function baseFormat(data, strict) {
  const isArray = Array.isArray(data);

  if (!isArray && (data === null || typeof data !== 'object')) {
    throw new TypeError('data must be an Object or Array');
  }

  const records = [];

  if (isArray) {
    for (let i = 0, len = data.length; i < len; ++i) {
      records[i] = objectToRecord(data[i], strict);
    }
  } else {
    records.push(objectToRecord(data, strict));
  }

  return records.join('\n');
}

/**
 * convert to LTSV string from object or array.
 *
 * @param {Object|Object[]} data
 * @returns {string}
 * @see baseFormat
 */
export function format(data) {
  return baseFormat(data, false);
}

/**
 * convert to LTSV string from object or array.
 *
 * @param {Object|Object[]} data
 * @returns {string}
 * @see baseFormat
 */
export function formatStrict(data) {
  return baseFormat(data, true);
}

/**
 * convert to LTSV string from object or array.
 *
 * @param {Object|Object[]} data
 * @param {Object} options
 * @param {boolean} [options.strict=false]
 * @returns {string}
 * @see baseFormat
 */
export function stringify(data, options = {}) {
  const { strict = false } = options;

  return baseFormat(data, strict);
}
