"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatter = require("./cjs/formatter.js");

Object.keys(_formatter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _formatter[key];
    }
  });
});

var _parser = require("./cjs/parser.js");

Object.keys(_parser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _parser[key];
    }
  });
});

var _stream = require("./cjs/stream.js");

Object.keys(_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _stream[key];
    }
  });
});

//# sourceMappingURL=index.js.map