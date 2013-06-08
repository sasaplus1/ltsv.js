/*!
 * ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */

var parser = require('./parser'),
    formatter = require('./formatter');


/**
 * export some functions.
 */
module.exports = {

  // export parser functions.
  parse: parser.parse,
  parseLine: parser.parseLine,
  parseStrict: parser.parseStrict,
  parseLineStrict: parser.parseLineStrict,

  // export formatter functions.
  format: formatter.format,
  formatLine: formatter.formatLine,
  formatStrict: formatter.formatStrict,
  formatLineStrict: formatter.formatLineStrict,

  // export stream function.
  createLtsvToJsonStream: require('./stream').createLtsvToJsonStream

};
