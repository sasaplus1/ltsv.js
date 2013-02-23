# ltsv [![Build Status](https://travis-ci.org/sasaplus1/ltsv.png)](https://travis-ci.org/sasaplus1/ltsv)

[LTSV](http://ltsv.org/) parser and formatter

## Installation

```sh
$ npm install ltsv
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

ltsv.formatLine({ label1: 'value1', label2: 'value2' });
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

### parse(ltsv)

* `ltsv` string - LTSV string (multi line)

* `return` Array.Object - parsed objects

throw SyntaxError if ltsv records has no separator (":").

### parseLine(record)

* `record` string - record string

* `return` Object - parsed object

throw SyntaxError if record has no separator (":").

### parseStrict(ltsv)

* `ltsv` string - LTSV string (multi line)

* `return` Array.Object - parsed objects

throw SyntaxError if ltsv records has no separator (":").

throw SyntaxError if labels don't match for `/^[0-9A-Za-z_.-]+$/`.

throw SyntaxError if values don't match for `/^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/`.

### parseLineStrict(record)

* `record` string - record string

* `return` Object - parsed object

throw SyntaxError if record has no separator (":").

throw SyntaxError if labels don't match for `/^[0-9A-Za-z_.-]+$/`.

throw SyntaxError if values don't match for `/^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/`.

### format(ltsvArray)

* `ltsvArray` Array.Object - object array

* `return` string - LTSV formatted string

throw TypeError if ltsvArray is not Array types.

throw TypeError if ltsvArray objects are not Object types.

### formatLine(recordObj)

* `recordObj` Object - object

* `return` string - LTSV formatted string

throw TypeError if recordObj is not Object types.

### formatStrict(ltsvArray)

* `ltsvArray` Array.Object - object array

* `return` string - LTSV formatted string

throw TypeError if ltsvArray is not Array types.

throw TypeError if ltsvArray objects are not Object types.

throw SyntaxError if labels don't match for `/^[0-9A-Za-z_.-]+$/`.

throw SyntaxError if values don't match for `/^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/`.

### formatLineStrict(recordObj)

* `recordObj` Object - object

* `return` string - LTSV formatted string

throw TypeError if recordObj is not Object types.

throw SyntaxError if labels don't match for `/^[0-9A-Za-z_.-]+$/`.

throw SyntaxError if values don't match for `/^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/`.

### createLtsvToJsonStream(options)

* `options` object - option object

* `return` LtsvToJsonStream - LTSV to JSON stream

#### options

* `toObject` boolean - send object in data event

send object in data event if true.

default value is `false`.

* `strict` boolean - strict parse

use `parseLineStrict()` if true.

default value is `false`.

## Test

```sh
$ npm install
$ npm test
```

## License

The MIT License. Please see LICENSE file.
