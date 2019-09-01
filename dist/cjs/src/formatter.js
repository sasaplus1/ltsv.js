"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
/**
 * convert to record string from object
 *
 * @private
 * @param record
 * @param strict
 * @throws {TypeError}
 */
function objectToRecord(record, strict) {
    if (record === null || typeof record !== 'object') {
        throw new TypeError('record must be an Object');
    }
    const keys = Object.keys(record);
    const fields = [];
    for (let i = 0, len = keys.length; i < len; ++i) {
        const label = keys[i];
        const value = record[keys[i]];
        if (strict && !validator_1.isValidLabel(label)) {
            throw new SyntaxError(`unexpected character in label: "${label}"`);
        }
        if (strict && !validator_1.isValidValue(value)) {
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
    }
    else {
        records.push(objectToRecord(data, strict));
    }
    return records.join('\n');
}
/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @see baseFormat
 */
function format(data) {
    return baseFormat(data, false);
}
exports.format = format;
/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @see baseFormat
 */
function formatStrict(data) {
    return baseFormat(data, true);
}
exports.formatStrict = formatStrict;
/**
 * convert to LTSV string from object or array
 *
 * @param data
 * @param options
 * @see baseFormat
 */
function stringify(data, options = { strict: false }) {
    const { strict = false } = options;
    return baseFormat(data, strict);
}
exports.stringify = stringify;
//# sourceMappingURL=formatter.js.map