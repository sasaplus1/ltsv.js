var fs = require('fs'),
    path = require('path'),
    benchmark = require('benchmark'),
    ltsv = require('../'),
    suite = new benchmark.Suite;

suite
  .add('read access_log.ltsv in LtsvToJsonStream', {
    defer: true,
    fn: function(deferred) {
      var ltjs = ltsv.createLtsvToJsonStream();

      ltjs.on('readable', function() {
        while (ltjs.read() !== null);
      });
      ltjs.once('end', function() {
        deferred.resolve();
      });

      fs.createReadStream(
          path.join(__dirname, 'access_log.ltsv')).pipe(ltjs);
    },
    onComplete: function(event) {
      console.log(String(event.target));
    }
  })
  .run({
    async: true
  });
