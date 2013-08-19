/*!
 * ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */

var util = require('util'),
    validator = require('./validator');


/**
 * format to LTSV from object or object array.
 *
 * @param {Object|Object[]} mixed object or object array.
 * @throws {TypeError} if parameter is not a Object
 * @return {String} LTSV string.
 */
function format(mixed) {
  var mixedType = getType_(mixed),
      records = [],
      i, len;

  if (mixedType !== 'object') {
    throw new TypeError(
        'parameter should be an Object or Array: ' + mixedType);
  }

  if (util.isArray(mixed)) {
    for (i = 0, len = mixed.length; i < len; ++i) {
      records[i] = objectToRecord_(mixed[i]);
    }
  } else {
    records.push(objectToRecord_(mixed));
  }

  return records.join('\n');
}


/**
 * format to LTSV from object or object array.
 * validate label and value.
 *
 * @param {Object|Object[]} mixed object or object array.
 * @throws {TypeError} if parameter is not a Object
 * @return {String} LTSV string.
 */
function formatStrict(mixed) {
  var mixedType = getType_(mixed),
      records = [],
      i, len;

  if (mixedType !== 'object') {
    throw new TypeError(
        'parameter should be an Object or Array: ' + mixedType);
  }

  if (util.isArray(mixed)) {
    for (i = 0, len = mixed.length; i < len; ++i) {
      records[i] = objectToRecordStrict_(mixed[i]);
    }
  } else {
    records.push(objectToRecordStrict_(mixed));
  }

  return records.join('\n');
}


/**
 * format to record from object.
 *
 * @private
 * @param {Object} object object.
 * @throws {TypeError} if parameter is not a Object
 * @return {String} record string.
 */
function objectToRecord_(object) {
  var objectType = getType_(object),
      keys, fields, i, len;

  if (objectType !== 'object') {
    throw new TypeError(
        'parameter should be an Object: ' + objectType);
  }

  keys = Object.keys(object);
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
 * @throws {TypeError} if parameter is not a Object
 * @throws {SyntaxError} if label or value has unexpected character
 * @return {String} record string.
 */
function objectToRecordStrict_(object) {
  var objectType = getType_(object),
      keys, fields, i, len, label, value;

  if (objectType !== 'object') {
    throw new TypeError(
        'parameter should be an Object: ' + objectType);
  }

  keys = Object.keys(object);
  fields = [];

  for (i = 0, len = keys.length; i < len; ++i) {
    label = keys[i];
    value = object[label];

    if (!validator.isValidLabel(label)) {
      throw new SyntaxError(
          'unexpected character for label: "' + label + '"');
    }

    if (!validator.isValidValue(value)) {
      throw new SyntaxError(
          'unexpected character for value: "' + value + '"');
    }

    fields[i] = label + ':' + value;
  }

  return fields.join('\t');
}


/**
 * get type of value.
 * return string of "null" if value is null.
 *
 * @param {*} value value.
 * @return {String} type of value.
 */
function getType_(value) {
  return (value === null) ? 'null' : typeof value;
}


/**
 * export private functions if NODE_ENV variable is test.
 *
 * otherwise export public functions.
 */
module.exports =
    (process.env.NODE_ENV === 'test') ? {
      format: format,
      formatStrict: formatStrict,
      objectToRecord_: objectToRecord_,
      objectToRecordStrict_: objectToRecordStrict_,
      getType_: getType_
    } : {
      format: format,
      formatStrict: formatStrict
    };
