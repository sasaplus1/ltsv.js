var assert = require('chai').assert,
    utility = require('../lib/utility');

suite('utility', function() {

  suite('#getTypeName()', function() {

    test('return typeof value', function() {
      assert.strictEqual(
          utility.getTypeName(1),
          'number',
          'getTypeName(1) should be returned "number"');
      assert.strictEqual(
          utility.getTypeName('a'),
          'string',
          'getTypeName("a") should be returned "string"');
      assert.strictEqual(
          utility.getTypeName(true),
          'boolean',
          'getTypeName(true) should be returned "boolean"');
      assert.strictEqual(
          utility.getTypeName(void 0),
          'undefined',
          'getTypeName(undefined) should be returned "undefined"');
      assert.strictEqual(
          utility.getTypeName(function() {}),
          'function',
          'getTypeName(function() {}) should be returned "function"');
      assert.strictEqual(
          utility.getTypeName({}),
          'object',
          'getTypeName({}) should be returned "object"');
    });

    test('return "null" if parameter is null', function() {
      assert.strictEqual(
          utility.getTypeName(null),
          'null',
          'getTypeName(null) should be returned "null"');
    });

  });

});
