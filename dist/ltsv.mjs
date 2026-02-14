//#region src/validator.ts
/**
* validate label
*
* @param label
*/
function isValidLabel(label) {
	return /^[0-9A-Za-z_.-]+$/.test(label);
}
/**
* validate for value
*
* @param value
*/
function isValidValue(value) {
	return /^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/.test(value);
}

//#endregion
//#region src/formatter.ts
/**
* convert to record string from object
*
* @private
* @param record
* @param strict
* @throws {TypeError}
*/
function objectToRecord(record, strict) {
	if (record === null || typeof record !== "object") throw new TypeError("record must be an Object");
	const keys = Object.keys(record);
	const fields = [];
	for (let i = 0, len = keys.length; i < len; ++i) {
		const label = keys[i];
		if (!label) throw new TypeError("label must be a non-empty string");
		const value = record[label];
		if (!value) throw new TypeError("value must be a non-empty string");
		if (strict && !isValidLabel(label)) throw new SyntaxError(`unexpected character in label: "${label}"`);
		if (strict && !isValidValue(value)) throw new SyntaxError(`unexpected character in value: "${value}"`);
		fields[i] = label + ":" + value;
	}
	return fields.join("	");
}
/**
* convert to LTSV string from object or array
*
* @private
* @param data
* @param strict
* @throws {TypeError}
*/
function baseFormat(data, strict) {
	const isArray = Array.isArray(data);
	if (!isArray && (data === null || typeof data !== "object")) throw new TypeError("data must be an Object or Array");
	const records = [];
	if (isArray) for (let i = 0, len = data.length; i < len; ++i) {
		const record = data[i];
		if (!record) throw new TypeError("record must be an Object");
		records[i] = objectToRecord(record, strict);
	}
	else records.push(objectToRecord(data, strict));
	return records.join("\n");
}
/**
* convert to LTSV string from object or array
*
* @param data
* @see baseFormat
*/
function format(data) {
	return baseFormat(data, false);
}
/**
* convert to LTSV string from object or array
*
* @param data
* @see baseFormat
*/
function formatStrict(data) {
	return baseFormat(data, true);
}
/**
* convert to LTSV string from object or array
*
* @param data
* @param options
* @see baseFormat
*/
function stringify(data, options = { strict: false }) {
	const { strict = false } = options;
	return baseFormat(data, strict);
}

//#endregion
//#region src/parser.ts
/**
* split to label and value from field
*
* @private
* @param chunk
* @param strict
* @throws {SyntaxError}
* @throws {TypeError}
*/
function splitField(chunk, strict) {
	if (chunk === void 0) throw new TypeError("chunk is undefined");
	const index = chunk.indexOf(":");
	if (index === -1) throw new SyntaxError(`field separator is not found: "${chunk}"`);
	const label = chunk.slice(0, index);
	const value = chunk.slice(index + 1);
	if (strict && !isValidLabel(label)) throw new SyntaxError(`unexpected character in label: "${label}"`);
	if (strict && !isValidValue(value)) throw new SyntaxError(`unexpected character in value: "${value}"`);
	return {
		label,
		value
	};
}
/**
* parse LTSV record
*
* @private
* @param line
* @param strict
*/
function baseParseLine(line, strict) {
	const fields = String(line).replace(/(?:\r?\n)+$/, "").split("	");
	const record = {};
	for (let i = 0, len = fields.length; i < len; ++i) {
		const { label, value } = splitField(fields[i], strict);
		record[label] = value;
	}
	return record;
}
/**
* parse LTSV text
*
* @private
* @param text
* @param strict
*/
function baseParse(text, strict) {
	const lines = String(text).replace(/(?:\r?\n)+$/, "").split(/\r?\n/);
	const records = [];
	for (let i = 0, len = lines.length; i < len; ++i) records[i] = baseParseLine(lines[i], strict);
	return records;
}
/**
* parse LTSV text
*
* @param text
*/
function parse(text) {
	return baseParse(text, false);
}
/**
* parse LTSV record
*
* @param line
*/
function parseLine(line) {
	return baseParseLine(line, false);
}
/**
* parse LTSV text
*
* @param text
*/
function parseStrict(text) {
	return baseParse(text, true);
}
/**
* parse LTSV record
*
* @param line
*/
function parseLineStrict(line) {
	return baseParseLine(line, true);
}

//#endregion
export { format, formatStrict, isValidLabel, isValidValue, parse, parseLine, parseLineStrict, parseStrict, stringify };
//# sourceMappingURL=ltsv.mjs.map