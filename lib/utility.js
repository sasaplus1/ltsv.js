/**
 * utility object.
 * it has fallback functions.
 */
var utility = (function() {

  var util = {
    isArray: Array.isArray || isArray
  };

  /**
   * require for node.js.
   * drop this code when generate minified script with UglifyJS.
   */
  function require_() {
    util = require('util');
  }
  require_();

  /**
   * fallback of Object#keys.
   *
   * @param {Object} object target object.
   * @throws {TypeError} if parameter is not an Object.
   * @return {String[]} key array.
   */
  function getObjectKeys(object) {
    var objectType = getType(object),
        keys = [],
        key;

    // throw error if objectType is not array, function and object
    switch (objectType) {
      case 'array':
      case 'function':
      case 'object':
        break;
      default:
        throw new TypeError('object must be an Object: ' + object);
    }

    for (key in object) {
      object.hasOwnProperty(key) && keys.push(key);
    }

    return keys;
  }

  /**
   * get type of value.
   *
   * return "null" if value is null.
   * return "array" if value is Array.
   * otherwise return `typeof value`.
   *
   * @param {*} value target value.
   * @return {String} type of value.
   */
  function getType(value) {
    return (value === null) ? 'null' : (util.isArray(value)) ? 'array' :
        typeof value;
  }

  /**
   * fallback of Array#isArray.
   *
   * @param {*} value target value.
   * @return {Boolean} return true if value is Array.
   */
  function isArray(value) {
    return (Object.prototype.toString.call(value) === '[object Array]');
  }

  /**
   * export.
   * export with fallback functions if test env.
   */
  return (
      typeof Mocha !== 'undefined' ||
      typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
  ) ? {
    getObjectKeys: getObjectKeys,
    getType: getType,
    isArray: isArray
  } : {
    getObjectKeys: Object.keys || getObjectKeys,
    getType: getType,
    isArray: util.isArray
  };

}());


/**
 * export for node.js.
 * drop this code when generate minified script with UglifyJS.
 */
function export_() {
  module.exports = utility;
}
export_();
