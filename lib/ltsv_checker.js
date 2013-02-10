// ltsv Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/ltsv
// Released under the MIT License.

var labelSyntax = /^[0-9A-Za-z_.-]+$/,
    valueSyntax = new RegExp('^[\x01-\x08\x0B\x0C\x0E-\xFF]*$');

function checkLabel(label) {
  return labelSyntax.test(label);
}

function checkValue(value) {
  return valueSyntax.test(value);
}

module.exports = {
  checkLabel: checkLabel,
  checkValue: checkValue
};
