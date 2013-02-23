// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

var checker = require('./ltsv_checker');

function parse(ltsv) {
  try {
    return parse_(ltsv);
  } catch (e) {
    throw e;
  }
}

function parseLine(record) {
  try {
    return parseLine_(record);
  } catch (e) {
    throw e;
  }
}

function parseStrict(ltsv) {
  try {
    return parse_(ltsv, splitFieldStrict_);
  } catch (e) {
    throw e;
  }
}

function parseLineStrict(record) {
  try {
    return parseLine_(record, splitFieldStrict_);
  } catch (e) {
    throw e;
  }
}

function parse_(ltsv, fn) {
  var ltsvStr = String(ltsv),
      records = ltsvStr.split(/\r?\n/),
      result = [],
      i, len;

  for (i = 0, len = records.length; i < len; ++i) {
    result[i] = parseLine_(records[i], fn);
  }

  return result;
}

function parseLine_(record, fn) {
  var recordStr = String(record).replace(/(?:\r?\n)+$/, ''),
      fields = recordStr.split('\t'),
      result = {},
      i, len, field;

  fn || (fn = splitField_);

  for (i = 0, len = fields.length; i < len; ++i) {
    field = fn(fields[i]);
    result[field.label] = field.value;
  }

  return result;
}

function splitField_(field) {
  var fieldStr = String(field),
      separatorIndex = fieldStr.indexOf(':');

  if (separatorIndex === -1) {
    throw new SyntaxError('field separator not found: "' + fieldStr + '"');
  }

  return {
    label: fieldStr.slice(0, separatorIndex),
    value: fieldStr.slice(separatorIndex + 1)
  };
}

function splitFieldStrict_(field) {
  var splittedField;

  try {
    splittedField = splitField_(field);
  } catch (e) {
    throw e;
  }

  if (!checker.isValidLabel(splittedField.label)) {
    throw new SyntaxError('unexpected character of label: "' +
        splittedField.label + '"');
  }

  if (!checker.isValidValue(splittedField.value)) {
    throw new SyntaxError('unexpected character of value: "' +
        splittedField.value + '"');
  }

  return splittedField;
}

module.exports =
    (process.env.NODE_ENV === 'test') ? {
      parse: parse,
      parseLine: parseLine,
      parseStrict: parseStrict,
      parseLineStrict: parseLineStrict,
      parse_: parse_,
      parseLine_: parseLine_,
      splitField_: splitField_,
      splitFieldStrict_: splitFieldStrict_
    } : {
      parse: parse,
      parseLine: parseLine,
      parseStrict: parseStrict,
      parseLineStrict: parseLineStrict
    };
