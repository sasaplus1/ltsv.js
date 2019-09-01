"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * validate label
 *
 * @param label
 */
function isValidLabel(label) {
    return /^[0-9A-Za-z_.-]+$/.test(label);
}
exports.isValidLabel = isValidLabel;
/**
 * validate for value
 *
 * @param value
 */
function isValidValue(value) {
    // eslint-disable-next-line no-control-regex
    return /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/.test(value);
}
exports.isValidValue = isValidValue;
//# sourceMappingURL=validator.js.map