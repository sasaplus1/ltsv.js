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
* parse LTSV record
*
* @param line
*/
function parseLine(line) {
	return baseParseLine(line, false);
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
//#region src/whatwg_stream.ts
/**
* transform and push to stream
*
* @param text
* @param isFlush
* @param controller
*/
function push(text, isFlush, controller) {
	let next = 0;
	let last = 0;
	let error = null;
	while (true) {
		let index = text.indexOf("\n", next);
		if (index === -1) if (isFlush && next < text.length) index = text.length - 1;
		else break;
		const line = text.slice(next, index + 1);
		let record = {};
		try {
			record = this.parse(line);
		} catch (e) {
			if (e instanceof Error) error = e;
		}
		if (error) break;
		controller.enqueue(this.objectMode ? record : JSON.stringify(record));
		last = next = index + 1;
	}
	this.buffer = text.slice(last);
	if (error) controller.error(error);
}
/**
* LTSV to JSON transform stream
*
* @param options
*/
function LtsvToJsonStream(options = {
	objectMode: false,
	strict: false
}) {
	const { objectMode = false, strict = false } = options;
	const instance = {
		buffer: "",
		objectMode,
		parse: strict ? parseLineStrict : parseLine
	};
	return {
		transform(chunk, controller) {
			push.call(instance, instance.buffer + chunk, false, controller);
		},
		flush(controller) {
			push.call(instance, instance.buffer, true, controller);
		}
	};
}
function createLtsvToJsonStream(options) {
	return new TransformStream(LtsvToJsonStream(options));
}

//#endregion
export { LtsvToJsonStream, createLtsvToJsonStream };
//# sourceMappingURL=ltsv.mjs.map