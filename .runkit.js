const ltsv = require('ltsv');

ltsv.parse('name:mario\tcolor:red\nname:luigi\tcolor:green\n');
// => [{ name: 'mario', color: 'red' }, { name: 'luigi', color: 'green' }]

ltsv.parseLine('name:peach\tcolor:pink\n');
// => { name: 'peach', color: 'pink' }

ltsv.format([
  { name: 'mario', color: 'red' },
  { name: 'luigi', color: 'green' }
]);
// => 'name:mario\tcolor:red\nname:luigi\tcolor:green'

const stream = ltsv.createLtsvToJsonStream();

stream.on('readable', function() {
  for (let buffer = stream.read(); buffer !== null; buffer = stream.read()) {
    console.log(buffer);
    // => '{ "name": "mario", "color": "red" }'
    // => '{ "name": "luigi", "color": "green" }'
  }
});

stream.write('name:mari');
stream.write('o\tcolor:');
stream.write('red\nname');
stream.write(':luigi\tc');
stream.write('olor:gree');
stream.end('n\n');
