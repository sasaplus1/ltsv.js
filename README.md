# ltsv

[![Build Status](https://travis-ci.org/sasaplus1/ltsv.js.png)](https://travis-ci.org/sasaplus1/ltsv.js)
[![Dependency Status](https://gemnasium.com/sasaplus1/ltsv.js.png)](https://gemnasium.com/sasaplus1/ltsv.js)

[LTSV](http://ltsv.org/) parser and formatter

## Installation

### node.js

```sh
$ npm install ltsv
```

### bower

```sh
$ bower install ltsv
```

```html
<script src="ltsv.min.js"></script>
```

## Usage

```js
var ltsv = require('ltsv');

ltsv.parse([
  'label1:value1\tlabel2:value2',
  'label1:value1\tlabel2:value2',
  'label1:value1\tlabel2:value2'
].join('\n'));
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

* `text` string - LTSV text
* `return` Object[] - parsed objects

split to LTSV records.

throw SyntaxError if `text` has no separator.

### parseLine(line)

* `line` string - LTSV line
* `return` Object - parsed object

split to LTSV record.

throw SyntaxError if `line` has no separator.

### parseStrict(text)

* `text` string - LTSV text
* `return` Object[] - parsed objects

split to LTSV records and validate label and value of fields.

throw SyntaxError if `text` has no separator.
also throw SyntaxError if `text` has unexpected character.

### parseLineStrict(line)

* `line` string - LTSV line
* `return` Object - parsed object

split to LTSV record.

throw SyntaxError if `line` has no separator.
also throw SyntaxError if `line` has unexpected character.

### format(mixed)

* `mixed` Object|Object[] - object or object array
* `return` string - LTSV text

convert to LTSV text.

throw TypeError if `mixed` is not an object or array.

### formatStrict(mixed)

* `mixed` Object|Object[] - object or object array
* `return` string - LTSV text

convert to LTSV text.

throw TypeError if `mixed` is not an object or array.
also throw SyntaxError if `mixed` has unexpected character.

### createLtsvToJsonStream([options])

* `options` object - option object
* `return` LtsvToJsonStream - LTSV to JSON stream

return LtsvToJsonStream instance. cannot use by browser.

#### options

* `encoding` string - StringDecoder encoding
* `toObject` boolean - flag of send to object
* `strict` boolean - flag of strict parse

##### encoding

StringDecoder's encoding.

if not set, use "utf8".

##### toObject

send object if `toObject` is true.
otherwise send JSON string.

if not set, `toObject` is false.

##### strict

strict parse if `strict` is true.
otherwise not strict parse.

if not set, `strict` is false.

## Test

### node.js

```sh
$ npm install
$ npm test
```

### browser

```sh
$ npm install
$ npm run-script bower
$ npm run-script testem
```

## License

The MIT License. Please see LICENSE file.
