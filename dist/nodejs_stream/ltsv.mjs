import { Transform } from "stream";
import { StringDecoder } from "string_decoder";

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
//#region src/nodejs_stream.ts
/**
* LTSV to JSON transform stream
*/
var LtsvToJsonStream = class extends Transform {
	/**
	* chunk buffer
	*/
	buffer;
	/**
	* for decode chunks
	*/
	decoder;
	/**
	* if true, pass object to next stream
	*/
	objectMode;
	/**
	* parser function
	*/
	parse;
	/**
	* constructor
	*
	* @param options
	*/
	constructor(options = {
		encoding: "utf8",
		objectMode: false,
		strict: false
	}) {
		super({
			...options,
			decodeStrings: true,
			objectMode: true
		});
		const { encoding = "utf8", objectMode = false, strict = false } = options;
		this.objectMode = objectMode;
		this.parse = strict ? parseLineStrict : parseLine;
		this.buffer = "";
		this.decoder = new StringDecoder(encoding);
	}
	/**
	* transform and push to stream.
	*
	* @private
	* @param text
	* @param isFlush
	* @param callback
	*/
	_push(text, isFlush, callback) {
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
			if (this.push(this.objectMode ? record : JSON.stringify(record))) last = next = index + 1;
			else break;
		}
		this.buffer = text.slice(last);
		callback(error);
	}
	/**
	* _transform implementation.
	*
	* @private
	* @param chunk
	* @param encoding
	* @param callback
	*/
	_transform(chunk, _encoding, callback) {
		this._push(this.buffer + this.decoder.write(chunk), false, callback);
	}
	/**
	* _flush implementation.
	*
	* @private
	* @param callback
	*/
	_flush(callback) {
		this._push(this.buffer + this.decoder.end(), true, callback);
	}
};
/**
* create LtsvToJsonStream instance.
*
* @param options
* @see LtsvToJsonStream
*/
function createLtsvToJsonStream(options) {
	return new LtsvToJsonStream(options);
}

//#endregion
export { LtsvToJsonStream, createLtsvToJsonStream };
//# sourceMappingURL=ltsv.mjs.map