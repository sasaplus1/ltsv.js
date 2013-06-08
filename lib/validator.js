/*!
 * ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */

var labelRegExp = /^[0-9A-Za-z_.-]+$/,
    valueRegExp = /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/;


/**
 * validate label.
 *
 * @param {String} label label string.
 * @return {Boolean} return true if validation success.
 */
function isValidLabel(label) {
  return labelRegExp.test(label);
}


/**
 * validate value.
 *
 * @param {String} value value string.
 * @return {Boolean} return true if validation success.
 */
function isValidValue(value) {
  return valueRegExp.test(value);
}


/**
 * export some functions.
 */
module.exports = {
  isValidLabel: isValidLabel,
  isValidValue: isValidValue
};
