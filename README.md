# ltsv.js

[![Build Status](https://travis-ci.org/sasaplus1/ltsv.js.svg)](https://travis-ci.org/sasaplus1/ltsv.js)
[![Dependency Status](https://gemnasium.com/sasaplus1/ltsv.js.svg)](https://gemnasium.com/sasaplus1/ltsv.js)
[![NPM version](https://badge.fury.io/js/ltsv.svg)](http://badge.fury.io/js/ltsv)
[![Bower version](https://badge.fury.io/bo/ltsv.svg)](http://badge.fury.io/bo/ltsv)

[LTSV](http://ltsv.org/) parser and formatter

## Installation

### npm

```sh
$ npm install ltsv
```

### bower

```sh
$ bower install ltsv
```

## Usage

### node.js

```js
var ltsv = require('ltsv');
```

### browser

```html
<script src="ltsv.min.js"></script>
```

### Example

```js
ltsv.parse(
  'label1:value1\tlabel2:value2\n' +
  'label1:value1\tlabel2:value2\n' +
  'label1:value1\tlabel2:value2'
);
// [ { label1: 'value1', label2: 'value2' },
//   { label1: 'value1', label2: 'value2' },
//   { label1: 'value1', label2: 'value2' } ]

ltsv.parseLine('label1:value1\tlabel2:value2');
// { label1: 'value1', label2: 'value2' }
ltsv.parseLine('label1:value1\tlabel2:value2\n');
// { label1: 'value1', label2: 'value2' }
ltsv.parseLine('label1:value1\tlabel2:value2\r\n');
// { label1: 'value1', label2: 'value2' }

ltsv.format([
  { label1: 'value1', label2: 'value2' },
  { label1: 'value1', label2: 'value2' },
  { label1: 'value1', label2: 'value2' }
]);
// 'label1:value1\tlabel2:value2\nlabel1:value1\tlabel2:value2\nlabel1:value1\tlabel2:value2'

ltsv.format({ label1: 'value1', label2: 'value2' });
// 'label1:value1\tlabel2:value2'
```

```js
var fs = require('fs'),
    ltsv = require('ltsv'),
    ltjs = ltsv.createLtsvToJsonStream({
      toObject: false,
      strict: false
    });

// access.log:
// l1:v1\tl2:v2\n
// l1:v1\tl2:v2\n
// l1:v1\tl2:v2\n
fs.createReadStream('./access.log').pipe(ltjs).pipe(process.stdout);
// {"l1":"v1","l2":"v2"}{"l1":"v1","l2":"v2"}{"l1":"v1","l2":"v2"}
```

## Functions

### parse(text)

* `text`
  * `String` - LTSV text
* `return`
  * `Object[]` - parsed objects

split to LTSV records.

throw SyntaxError if `text` has no separator.

### parseLine(line)

* `line`
  * `String` - LTSV line
* `return`
  * `Object` - parsed object

split to LTSV record.

throw SyntaxError if `line` has no separator.

### parseStrict(text)

* `text`
  * `String` - LTSV text
* `return`
  * `Object[]` - parsed objects

split to LTSV records and validate label and value of fields.

throw SyntaxError if `text` has no separator.
also throw SyntaxError if `text` has unexpected character.

### parseLineStrict(line)

* `line`
  * `String` - LTSV line
* `return`
  * `Object` - parsed object

split to LTSV record.

throw SyntaxError if `line` has no separator.
also throw SyntaxError if `line` has unexpected character.

### format(data)

* `data`
  * `Object|Object[]` - object or object array
* `return`
  * `String` - LTSV text

convert to LTSV text.

throw TypeError if `data` is not an object or array.

### formatStrict(data)

* `data`
  * `Object|Object[]` - object or object array
* `return`
  * `String` - LTSV text

convert to LTSV text.

throw TypeError if `data` is not an object or array.
also throw SyntaxError if `data` has unexpected character.

### createLtsvToJsonStream([options])

* `options`
  * `Object` - option object
* `return`
  * `LtsvToJsonStream` - LTSV to JSON stream

return LtsvToJsonStream instance. this function cannot use by browser.

#### options

* `encoding`
  * `String` - StringDecoder's encoding, default is `utf8`
* `toObject`
  * `Boolean` - convert to Object if true, default is `false`
* `strict`
  * `Boolean` - strict parse if true, default is `false`

## Test

### node.js

```sh
$ npm install
$ npm test
```

### browser

```sh
$ npm install
$ npm run testem
```

## License

The MIT license. Please see LICENSE file.
