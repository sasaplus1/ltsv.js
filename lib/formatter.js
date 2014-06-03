/**
 * dependency objects.
 */
var utility, validator;


/**
 * formatter object.
 * convert to LTSV format from object or object array.
 */
var formatter = (function() {

  /**
   * require for node.js.
   * drop this code when generate minified script with UglifyJS.
   */
  function require_() {
    utility = require('./utility');
    validator = require('./validator');
  }
  require_();

  /**
   * format to LTSV from object or object array.
   *
   * @param {Object|Object[]} data object or object array.
   * @throws {TypeError} if parameter is not an Object or Array.
   * @return {String} LTSV string.
   */
  function format(data) {
    var dataType = utility.getType(data),
        records = [],
        i, len;

    if (dataType !== 'object' && dataType !== 'array') {
      throw new TypeError('data must be an Object or Array: ' + dataType);
    }

    if (utility.isArray(data)) {
      for (i = 0, len = data.length; i < len; ++i) {
        records[i] = objectToRecord_(data[i]);
      }
    } else {
      records.push(objectToRecord_(data));
    }

    return records.join('\n');
  }

  /**
   * format to LTSV from object or object array.
   * validate label and value.
   *
   * @param {Object|Object[]} data object or object array.
   * @throws {TypeError} if parameter is not an Object or Array.
   * @return {String} LTSV string.
   */
  function formatStrict(data) {
    var dataType = utility.getType(data),
        records = [],
        i, len;

    if (dataType !== 'object' && dataType !== 'array') {
      throw new TypeError('data must be an Object or Array: ' + dataType);
    }

    if (utility.isArray(data)) {
      for (i = 0, len = data.length; i < len; ++i) {
        records[i] = objectToRecordStrict_(data[i]);
      }
    } else {
      records.push(objectToRecordStrict_(data));
    }

    return records.join('\n');
  }

  /**
   * format to record from object.
   *
   * @private
   * @param {Object} object object.
   * @throws {TypeError} if parameter is not an Object.
   * @return {String} record string.
   */
  function objectToRecord_(object) {
    var objectType = utility.getType(object),
        keys, fields, i, len;

    if (objectType !== 'object') {
      throw new TypeError('object must be an Object: ' + objectType);
    }

    keys = utility.getObjectKeys(object);
    fields = [];

    for (i = 0, len = keys.length; i < len; ++i) {
      fields[i] = keys[i] + ':' + object[keys[i]];
    }

    return fields.join('\t');
  }

  /**
   * format to record from object and validate label and value.
   *
   * @private
   * @param {Object} object object.
   * @throws {TypeError} if parameter is not an Object.
   * @throws {SyntaxError} if label or value has unexpected character.
   * @return {String} record string.
   */
  function objectToRecordStrict_(object) {
    var objectType = utility.getType(object),
        keys, fields, i, len, label, value;

    if (objectType !== 'object') {
      throw new TypeError('object must be an Object: ' + objectType);
    }

    keys = utility.getObjectKeys(object);
    fields = [];

    for (i = 0, len = keys.length; i < len; ++i) {
      label = keys[i];
      value = object[label];

      if (!validator.isValidLabel(label)) {
        throw new SyntaxError('unexpected character of label: "' + label + '"');
      }

      if (!validator.isValidValue(value)) {
        throw new SyntaxError('unexpected character of value: "' + value + '"');
      }

      fields[i] = label + ':' + value;
    }

    return fields.join('\t');
  }

  /**
   * export.
   */
  return {
    format: format,
    formatStrict: formatStrict
  };

}());


/**
 * export for node.js.
 * drop this code when generate minified script with UglifyJS.
 */
function export_() {
  module.exports = formatter;
}
export_();
