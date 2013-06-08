/*!
 * ltsv Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/ltsv
 * Released under the MIT License.
 */


/**
 * get type of value.
 * return string of "null" if value is null.
 *
 * @param {*} value value.
 * @return {String} value type name.
 */
function getTypeName(value) {
  return (value === null) ? 'null' : typeof value;
}


/**
 * export getTypeName.
 */
module.exports = {
  getTypeName: getTypeName
};
