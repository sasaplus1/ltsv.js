# ltsv.js

[LTSV](http://ltsv.org/) parser, formatter, validator and TransformStream

## Installation

### npm

```console
$ npm install ltsv
```

## Usage

### node.js

```js
import * as ltsv from 'ltsv';
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
import * as fs from 'node:fs';
import * as ltsv from 'ltsv/nodejs_stream';

const stream = ltsv.createLtsvToJsonStream({
  encoding: 'utf8',
  objectMode: false,
  strict: false
});

// access.log:
// l1:v1\tl2:v2\n
// l1:v1\tl2:v2\n
// l1:v1\tl2:v2\n
fs.createReadStream('./access.log').pipe(stream).pipe(process.stdout);
// {"l1":"v1","l2":"v2"}{"l1":"v1","l2":"v2"}{"l1":"v1","l2":"v2"}
```

## Functions

see https://sasaplus1.github.io/ltsv.js

## License

The MIT license.
