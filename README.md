# ltsv [![Build Status](https://travis-ci.org/sasaplus1/ltsv.png)](https://travis-ci.org/sasaplus1/ltsv)

[LTSV](http://ltsv.org/) parser

## Installation

```sh
$ npm install ltsv
```

## Usage

```js
var ltsv = require('ltsv');

var line = [
  'field1:value1',
  'field2:value2',
  'field3:value3'
].join('\t');

var multiLine = [
  'field1:value1\tfield2:value2\tfield3:value3',
  'field1:value1\tfield2:value2\tfield3:value3',
  'field1:value1\tfield2:value2\tfield3:value3'
].join('\n');



console.dir(ltsv.parse(line));
// { field1: 'value1', field2: 'value2', field3: 'value3' }

console.dir(ltsv.parseLines(multiLine));
// [ { field1: 'value1', field2: 'value2', field3: 'value3' },
//   { field1: 'value1', field2: 'value2', field3: 'value3' },
//   { field1: 'value1', field2: 'value2', field3: 'value3' } ]
```

## Functions

### parse(ltsvStr)

* `ltsvStr` string - LTSV string

* `return` Object - parsed object

### parseLines(ltsvStr)

* `ltsvStr` string - LTSV string (multi line)

* `return` Array<Object> - parsed objects

## Test

```sh
$ npm install
$ npm test
```

## License

The MIT License. Please see LICENSE file.
