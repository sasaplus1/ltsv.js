// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

var util = require('util'),
    checker = require('./ltsv_checker');

function format(ltsvArray) {
  return format_(ltsvArray);
}

function formatLine(recordObj) {
  return formatLine_(recordObj);
}

function formatStrict(ltsvArray) {
  return format_(ltsvArray, true);
}

function formatLineStrict(recordObj) {
  return formatLine_(recordObj, true);
}

function format_(ltsvList, validation) {
  var i, len, result;

  if (!util.isArray(ltsvList)) {
    throw new TypeError('parameter ltsvList should be a Array, not ' +
        ltsvList);
  }

  result = [];
  for (i = 0, len = ltsvList.length; i < len; ++i) {
    result[i] = formatLine(ltsvList[i], validation);
  }

  return result.join('\n');
}

function formatLine_(recordObj, validation) {
  var i, len, keys, result;

  if (recordObj === null || typeof recordObj !== 'object') {
    throw new TypeError('parameter recordObj should be a Object, not ' +
        recordObj);
  }

  validation || (validation = false);

  result = [];
  keys = Object.keys(recordObj);
  for (i = 0, len = keys.length; i < len; ++i) {
    if (validation && !checker.isValidLabel(keys[i])) {
      throw new SyntaxError('unexpected character of label: "' + keys[i] + '"');
    }

    if (validation && !checker.isValidValue(recordObj[keys[i]])) {
      throw new SyntaxError('unexpected character of value: "' +
          recordObj[keys[i]] + '"');
    }

    result[i] = keys[i] + ':' + recordObj[keys[i]];
  }

  return result.join('\t');
}

module.exports =
    (process.env.NODE_ENV === 'test') ? {
      format: format,
      formatLine: formatLine,
      formatStrict: formatStrict,
      formatLineStrict: formatLineStrict,
      format_: format_,
      formatLine_: formatLine_
    } : {
      format: format,
      formatLine: formatLine,
      formatStrict: formatStrict,
      formatLineStrict: formatLineStrict
    };
