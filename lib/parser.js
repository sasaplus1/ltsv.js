/*!
 * ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */

var validator = require('./validator');


/**
 * split to records from LTSV.
 *
 * @param {String} text LTSV string.
 * @return {Object[]} object has fields.
 */
function parse(text) {
  var lines = String(text).replace(/(?:\r?\n)+$/, '').split(/\r?\n/),
      records = [],
      i, len;

  for (i = 0, len = lines.length; i < len; ++i) {
    records[i] = parseLine(lines[i]);
  }

  return records;
}


/**
 * split to fields from record.
 *
 * @param {String} line record string.
 * @return {Object} object has fields.
 */
function parseLine(line) {
  var fields = String(line).replace(/(?:\r?\n)+$/, '').split('\t'),
      record = {},
      i, len, field;

  for (i = 0, len = fields.length; i < len; ++i) {
    field = splitField_(fields[i]);
    record[field.label] = field.value;
  }

  return record;
}


/**
 * split to records from LTSV and validate label and value of fields.
 *
 * @param {String} text LTSV string.
 * @return {Object[]} object has fields.
 */
function parseStrict(text) {
  var lines = String(text).replace(/(?:\r?\n)+$/, '').split(/\r?\n/),
      records = [],
      i, len;

  for (i = 0, len = lines.length; i < len; ++i) {
    records[i] = parseLineStrict(lines[i]);
  }

  return records;
}


/**
 * split to fields from record and validate label and value of fields.
 *
 * @param {String} line record string.
 * @return {Object} object has fields.
 */
function parseLineStrict(line) {
  var fields = String(line).replace(/(?:\r?\n)+$/, '').split('\t'),
      record = {},
      i, len, field;

  for (i = 0, len = fields.length; i < len; ++i) {
    field = splitFieldStrict_(fields[i]);
    record[field.label] = field.value;
  }

  return record;
}


/**
 * split to label and value from field.
 *
 * @private
 * @param {String} chunk field string.
 * @throws {SyntaxError} if chunk not has separator
 * @return {Object} object has label and value.
 */
function splitField_(chunk) {
  var field = String(chunk),
      separatorIndex = field.indexOf(':');

  if (separatorIndex === -1) {
    throw new SyntaxError('field separator not found: "' + field + '"');
  }

  return {
    label: field.slice(0, separatorIndex),
    value: field.slice(separatorIndex + 1)
  };
}


/**
 * split to label and value from field and validate label and value.
 *
 * @private
 * @param {String} chunk field string.
 * @throws {SyntaxError} if label or value has unexpected character
 * @return {Object} object has label and value.
 */
function splitFieldStrict_(chunk) {
  var field = splitField_(chunk);

  if (!validator.isValidLabel(field.label)) {
    throw new SyntaxError(
        'unexpected character of label: "' + field.label + '"');
  }

  if (!validator.isValidValue(field.value)) {
    throw new SyntaxError(
        'unexpected character of value: "' + field.value + '"');
  }

  return field;
}


/**
 * export private functions if NODE_ENV variable is test.
 *
 * otherwise export public functions only.
 */
module.exports =
    (process.env.NODE_ENV === 'test') ? {
      parse: parse,
      parseLine: parseLine,
      parseStrict: parseStrict,
      parseLineStrict: parseLineStrict,
      splitField_: splitField_,
      splitFieldStrict_: splitFieldStrict_
    } : {
      parse: parse,
      parseLine: parseLine,
      parseStrict: parseStrict,
      parseLineStrict: parseLineStrict
    };
