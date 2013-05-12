// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

function flatten_(modules) {
  var result = {},
      keys,
      i, ilen,
      j, jlen;

  for (i = 0, ilen = modules.length; i < ilen; ++i) {
    keys = Object.keys(modules[i]);
    for (j = 0, jlen = keys.length; j < jlen; ++j) {
      result[keys[j]] = modules[i][keys[j]];
    }
  }

  return result;
}

var hasTransform = (!!require('stream').Transform);

module.exports = flatten_([
  require('./ltsv_parser'),
  require('./ltsv_formatter')
]);

module.exports.createLtsvToJsonStream =
    (hasTransform) ?
    require('./ltsv_to_json_stream2').createLtsvToJsonStream :
    require('./ltsv_to_json_stream').createLtsvToJsonStream;

module.exports.createLtsvToJsonStream1 =
    require('./ltsv_to_json_stream').createLtsvToJsonStream;

module.exports.createLtsvToJsonStream2 =
    (hasTransform) ?
    require('./ltsv_to_json_stream2').createLtsvToJsonStream :
    null;
