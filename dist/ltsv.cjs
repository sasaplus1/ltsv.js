function r(r){return/^[0-9A-Za-z_.-]+$/.test(r)}function e(r){return/^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/.test(r)}function t(t,n){if(null===t||"object"!=typeof t)throw new TypeError("record must be an Object");for(var o=Object.keys(t),i=[],a=0,u=o.length;a<u;++a){var c=o[a];if(!c)throw new TypeError("label must be a non-empty string");var f=t[c];if(!f)throw new TypeError("value must be a non-empty string");if(n&&!r(c))throw new SyntaxError('unexpected character in label: "'+c+'"');if(n&&!e(f))throw new SyntaxError('unexpected character in value: "'+f+'"');i[a]=c+":"+f}return i.join("\t")}function n(r,e){var n=Array.isArray(r);if(!n&&(null===r||"object"!=typeof r))throw new TypeError("data must be an Object or Array");var o=[];if(n)for(var i=0,a=r.length;i<a;++i){var u=r[i];if(!u)throw new TypeError("record must be an Object");o[i]=t(u,e)}else o.push(t(r,e));return o.join("\n")}function o(t,n){if(void 0===t)throw new TypeError("chunk is undefined");var o=t.indexOf(":");if(-1===o)throw new SyntaxError('field separator is not found: "'+t+'"');var i=t.slice(0,o),a=t.slice(o+1);if(n&&!r(i))throw new SyntaxError('unexpected character in label: "'+i+'"');if(n&&!e(a))throw new SyntaxError('unexpected character in value: "'+a+'"');return{label:i,value:a}}function i(r,e){for(var t=String(r).replace(/(?:\r?\n)+$/,"").split("\t"),n={},i=0,a=t.length;i<a;++i){var u=o(t[i],e);n[u.label]=u.value}return n}function a(r,e){for(var t=String(r).replace(/(?:\r?\n)+$/,"").split(/\r?\n/),n=[],o=0,a=t.length;o<a;++o)n[o]=i(t[o],e);return n}exports.format=function(r){return n(r,!1)},exports.formatStrict=function(r){return n(r,!0)},exports.isValidLabel=r,exports.isValidValue=e,exports.parse=function(r){return a(r,!1)},exports.parseLine=function(r){return i(r,!1)},exports.parseLineStrict=function(r){return i(r,!0)},exports.parseStrict=function(r){return a(r,!0)},exports.stringify=function(r,e){void 0===e&&(e={strict:!1});var t=e.strict;return n(r,void 0!==t&&t)};
//# sourceMappingURL=ltsv.cjs.map
