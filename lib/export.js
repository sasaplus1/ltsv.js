/**
 * export for the browser.
 * export helper functions if test env.
 */
var ltsv = (typeof Mocha !== 'undefined') ? {

  // formatter
  format: formatter.format,
  formatStrict: formatter.formatStrict,

  // parser
  parse: parser.parse,
  parseLine: parser.parseLine,
  parseStrict: parser.parseStrict,
  parseLineStrict: parser.parseLineStrict,

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
  parseLineStrict: parser.parseLineStrict

};


/**
 * export ltsv.
 *
 * export as amd module if define() implemented.
 * otherwise export in global.
 */
if (typeof define === 'function' && typeof define.amd === 'object') {
  define(function() {
    return ltsv;
  });
} else {
  global.ltsv = ltsv;
}
