/**
 * validate label
 *
 * @param label
 */
export function isValidLabel(label: string): boolean {
  return /^[0-9A-Za-z_.-]+$/.test(label);
}

/**
 * validate for value
 *
 * @param value
 */
export function isValidValue(value: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/.test(value);
}
