/*!
 * @license ltsv.js Copyright(c) 2013-2014 sasa+1
 * https://github.com/sasaplus1/ltsv.js
 * Released under the MIT license.
 */


var formatter = require('./lib/formatter'),
    parser = require('./lib/parser'),
    stream = require('./lib/stream'),
    utility = require('./lib/utility'),
    validator = require('./lib/validator');


/**
 * export.
 */
module.exports = (process.env.NODE_ENV === 'test') ? {

  // formatter
  format: formatter.format,
  formatStrict: formatter.formatStrict,

  // parser
  parse: parser.parse,
  parseLine: parser.parseLine,
  parseStrict: parser.parseStrict,
  parseLineStrict: parser.parseLineStrict,

  // stream
  createLtsvToJsonStream: stream.createLtsvToJsonStream,

  // utility
  getObjectKeys: utility.getObjectKeys,
  getType: utility.getType,
  isArray: utility.isArray,

  // validator
  isValidLabel: validator.isValidLabel,
  isValidValue: validator.isValidValue

} : {

  // formatter
  format: formatter.format,
  formatStrict: formatter.formatStrict,

  // parser
  parse: parser.parse,
  parseLine: parser.parseLine,
  parseStrict: parser.parseStrict,
  parseLineStrict: parser.parseLineStrict,

  // stream
  createLtsvToJsonStream: stream.createLtsvToJsonStream

};
