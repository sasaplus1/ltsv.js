/**
 * dependency object.
 */
var validator;


/**
 * parser object.
 * convert to object or object array from LTSV format string.
 */
var parser = (function() {

  /**
   * require for node.js.
   * drop this code when generate minified script with UglifyJS.
   */
  function require_() {
    validator = require('./validator');
  }
  require_();

  /**
   * split from LTSV to records.
   *
   * @param {String} text LTSV string.
   * @return {Object[]} object has fields.
   */
  function parse(text) {
    return parse_(text, parseLine);
  }

  /**
   * split from record to fields.
   *
   * @param {String} line record string.
   * @return {Object} object has fields.
   */
  function parseLine(line) {
    return parseLine_(line, splitField_);
  }

  /**
   * split from LTSV to records and validate label and value of fields.
   *
   * @param {String} text LTSV string.
   * @return {Object[]} object has fields.
   */
  function parseStrict(text) {
    return parse_(text, parseLineStrict);
  }

  /**
   * split from record to fields and validate label and value of fields.
   *
   * @param {String} line record string.
   * @return {Object} object has fields.
   */
  function parseLineStrict(line) {
    return parseLine_(line, splitFieldStrict_);
  }

  /**
   * base of parse function.
   *
   * @private
   * @param {String} line record string.
   * @param {Function} fn line parse function.
   * @return {Object[]} parsed records.
   */
  function parse_(text, fn) {
    var lines = String(text).replace(/(?:\r?\n)+$/, '').split(/\r?\n/),
        records = [],
        i, len;

    for (i = 0, len = lines.length; i < len; ++i) {
      records[i] = fn(lines[i]);
    }

    return records;
  }

  /**
   * base of parseLine function.
   *
   * @private
   * @param {String} line record string.
   * @param {Function} fn field split function.
   * @return {Object} parsed record.
   */
  function parseLine_(line, fn) {
    var fields = String(line).replace(/(?:\r?\n)+$/, '').split('\t'),
        record = {},
        i, len, field;

    for (i = 0, len = fields.length; i < len; ++i) {
      field = fn(fields[i]);
      record[field.label] = field.value;
    }

    return record;
  }

  /**
   * split to label and value from field.
   *
   * @private
   * @param {String} chunk field string.
   * @throws {SyntaxError} if chunk not has separator.
   * @return {Object} parsed field.
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
   * @throws {SyntaxError} if label or value has unexpected character.
   * @return {Object} parsed field.
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
   * export.
   */
  return {
    parse: parse,
    parseLine: parseLine,
    parseStrict: parseStrict,
    parseLineStrict: parseLineStrict
  };

}());


/**
 * export for node.js.
 * drop this code when generate minified script with UglifyJS.
 */
function export_() {
  module.exports = parser;
}
export_();
