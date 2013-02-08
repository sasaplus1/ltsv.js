# ltsv [![Build Status](https://travis-ci.org/sasaplus1/ltsv.png)](https://travis-ci.org/sasaplus1/ltsv)

LTSV parser

## Installation

```sh
$ npm install ltsv
```

## Usage

```js
var ltsv = require('ltsv'),
    data = ltsv.parse('field1:value1\tfield2:value2\tfield3:value3');

console.dir(data);
// { field1: 'value1', field2: 'value2', field3: 'value3' }
```

## License

The MIT License. Please see LICENSE file.
