var fs = require('fs'),
    path = require('path'),
    expect = require('expect.js'),
    stream = require('../');

describe('stream', function() {

  describe('#createLtsvToJsonStream()', function() {

    it('should create instance if not has parameter', function() {
      var ltjs = stream.createLtsvToJsonStream();

      expect(ltjs.toObject_).to.be(false);
      expect(ltjs.isStrict_).to.be(false);
    });

    it('should create instance if has parameter', function() {
      var ltjs = stream.createLtsvToJsonStream({
        toObject: true,
        strict: true
      });

      expect(ltjs.toObject_).to.be(true);
      expect(ltjs.isStrict_).to.be(true);
    });

  });

  describe('#write() and #end()', function() {

    it('should convert to JSON from LTSV', function(done) {
      var ltjs = stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        expect(json).to.eql([
          '{"label1":"value1","label2":"value2"}',
          '{"label3":"value3","label4":"value4"}'
        ]);
        done();
      });

      ltjs.write('label1:value1\tlabel2:value2');
      ltjs.end('\nlabel3:value3\tlabel4:value4');
    });

    it('should convert to JSON if LTSV has empty line of end', function(done) {
      var ltjs = stream.createLtsvToJsonStream(),
          json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        expect(json).to.eql([
          '{"label1":"value1","label2":"value2"}',
          '{"label3":"value3","label4":"value4"}'
        ]);
        done();
      });

      ltjs.write('label1:value1\tlabel2:value2');
      ltjs.end('\nlabel3:value3\tlabel4:value4\n');
    });

    it('should throw error if illegal LTSV', function(done) {
      var ltjs = stream.createLtsvToJsonStream();

      ltjs.once('error', function(err) {
        expect(err).not.to.be(null);
        done();
      });

      ltjs.end('\t');
    });

    describe('toObject mode', function() {

      it('should convert to Object from LTSV', function(done) {
        var ltjs = stream.createLtsvToJsonStream({ toObject: true }),
            json = [];

        ltjs.on('readable', function() {
          var buf;

          while ((buf = ltjs.read()) !== null) {
            json.push(buf);
          }
        });
        ltjs.once('end', function() {
          expect(json).to.eql([
            { label1: 'value1', label2: 'value2' },
            { label3: 'value3', label4: 'value4' }
          ]);
          done();
        });

        ltjs.write('label1:value1\tlabel2:value2');
        ltjs.end('\nlabel3:value3\tlabel4:value4');
      });

    });

    describe('isStrict mode', function() {

      it('should throw error if LTSV has unexpected character', function(done) {
        var ltjs = stream.createLtsvToJsonStream({ strict: true });

        ltjs.once('error', function(err) {
          expect(err).not.to.be(null);
          done();
        });

        ltjs.end('+:');
      });

    });

  });

  describe('#pipe()', function() {

    var ltjs;

    beforeEach(function() {
      ltjs = stream.createLtsvToJsonStream();
    });

    afterEach(function() {
      ltjs = null;
    });

    it('should convert LTSV log of 1 line', function(done) {
      var json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        expect(json).to.eql([
          '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
        ]);
        done();
      });

      fs.createReadStream(
          path.join(__dirname, './log/valid-1.ltsv')).pipe(ltjs);
    });

    it('should convert LTSV log of 3 line', function(done) {
      var json = [];

      ltjs.on('readable', function() {
        var buf;

        while ((buf = ltjs.read()) !== null) {
          json.push(buf);
        }
      });
      ltjs.once('end', function() {
        expect(json).to.eql([
          '{"aaa":"bbb","ccc":"ddd","eee":"fff"}',
          '{"aaa":"bbb","ccc":"ddd","eee":"fff"}',
          '{"aaa":"bbb","ccc":"ddd","eee":"fff"}'
        ]);
        done();
      });

      fs.createReadStream(
          path.join(__dirname, './log/valid-3.ltsv')).pipe(ltjs);
    });

    it('should throw error if invalid LTSV log', function(done) {
      // XXX: why fail when use ltjs.once?
      ltjs.on('error', function(err) {
        expect(err).not.to.be(null);
        done();
      });

      fs.createReadStream(
          path.join(__dirname, './log/invalid.ltsv')).pipe(ltjs);
    });

  });

  describe('#splitToLines_()', function() {

    it('should split to lines', function() {
      var ltjs = stream.createLtsvToJsonStream();

      expect(ltjs.splitToLines_('')).to.eql({
        lines: [],
        tail: ''
      });

      expect(ltjs.splitToLines_('line')).to.eql({
        lines: [],
        tail: 'line'
      });

      expect(ltjs.splitToLines_('1\n2\n3\n4\n5\n')).to.eql({
        lines: [
          '1', '2', '3', '4', '5'
        ],
        tail: ''
      });

      expect(ltjs.splitToLines_('\n\n\n')).to.eql({
        lines: [
          '', '', ''
        ],
        tail: ''
      });

      expect(ltjs.splitToLines_('line\nend')).to.eql({
        lines: [
          'line'
        ],
        tail: 'end'
      });
    });

  });

});
