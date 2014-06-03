/**
 * validator object.
 * it has validation functions.
 */
var validator = (function() {

  /**
   * regexp for label and value.
   */
  var labelRegExp = /^[0-9A-Za-z_.-]+$/,
      valueRegExp = /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/;

  /**
   * validate for label.
   *
   * @param {String} label label string.
   * @return {Boolean} return true if valid label.
   */
  function isValidLabel(label) {
    return labelRegExp.test(label);
  }

  /**
   * validate for value.
   *
   * @param {String} value value string.
   * @return {Boolean} return true if valid value.
   */
  function isValidValue(value) {
    return valueRegExp.test(value);
  }

  /**
   * export.
   */
  return {
    isValidLabel: isValidLabel,
    isValidValue: isValidValue
  };

}());


/**
 * export for node.js.
 * drop this code when generate minified script with UglifyJS.
 */
function export_() {
  module.exports = validator;
}
export_();
