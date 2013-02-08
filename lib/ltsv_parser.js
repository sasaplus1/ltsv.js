// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

function getField_(fieldStr) {
  var field = String(fieldStr),
      separatorIndex = field.indexOf(':');

  if (separatorIndex === -1) {
    throw new Error('"' + field + '" has not field separator');
  }

  return {
    label: field.slice(0, separatorIndex),
    value: field.slice(separatorIndex + 1)
  };
}

function parse(ltsvStr) {
  var ltsv = String(ltsvStr),
      records = ltsv.split('\t'),
      result = {},
      i, len, field;

  for (i = 0, len = records.length; i < len; ++i) {
    field = getField_(records[i]);
    result[field.label] = field.value;
  }

  return result;
}

function parseLines(ltsvStr) {
  var ltsv = String(ltsvStr),
      lines = ltsv.split(/\r?\n/),
      result = [],
      i, len;

  for (i = 0, len = lines.length; i < len; ++i) {
    result[i] = parse(lines[i]);
  }

  return result;
}

module.exports = {
  parse: parse,
  parseLines: parseLines
};
