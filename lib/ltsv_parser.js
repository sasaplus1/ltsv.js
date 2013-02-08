// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

function parse(ltsvStr) {
  var ltsv = String(ltsvStr),
      records = ltsv.split('\t'),
      result = {},
      i, len, field;

  for (i = 0, len = records.length; i < len; ++i) {
    field = records[i].split(':');
    result[field[0]] = field[1];
  }

  return result;
}

module.exports = {
  parse: parse
};
