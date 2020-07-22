"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLineStrict = exports.parseStrict = exports.parseLine = exports.parse = void 0;
const validator_1 = require("./validator");
/**
 * split to label and value from field
 *
 * @private
 * @param chunk
 * @param strict
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
    if (strict && !validator_1.isValidLabel(label)) {
        throw new SyntaxError(`unexpected character in label: "${label}"`);
    }
    if (strict && !validator_1.isValidValue(value)) {
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
 * parse LTSV text
 *
 * @private
 * @param text
 * @param strict
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
 * parse LTSV text
 *
 * @param text
 */
function parse(text) {
    return baseParse(text, false);
}
exports.parse = parse;
/**
 * parse LTSV record
 *
 * @param line
 */
function parseLine(line) {
    return baseParseLine(line, false);
}
exports.parseLine = parseLine;
/**
 * parse LTSV text
 *
 * @param text
 */
function parseStrict(text) {
    return baseParse(text, true);
}
exports.parseStrict = parseStrict;
/**
 * parse LTSV record
 *
 * @param line
 */
function parseLineStrict(line) {
    return baseParseLine(line, true);
}
exports.parseLineStrict = parseLineStrict;
//# sourceMappingURL=parser.js.map