function r(r,e){if(void 0===r)throw new TypeError("chunk is undefined");var t=r.indexOf(":");if(-1===t)throw new SyntaxError('field separator is not found: "'+r+'"');var n=r.slice(0,t),o=r.slice(t+1);if(e&&!function(r){return/^[0-9A-Za-z_.-]+$/.test(r)}(n))throw new SyntaxError('unexpected character in label: "'+n+'"');if(e&&!function(r){return/^[\x01-\x08\x0B\x0C\x0E-\xFF]*$/.test(r)}(o))throw new SyntaxError('unexpected character in value: "'+o+'"');return{label:n,value:o}}function e(e,t){for(var n=String(e).replace(/(?:\r?\n)+$/,"").split("\t"),o={},i=0,a=n.length;i<a;++i){var f=r(n[i],t);o[f.label]=f.value}return o}function t(r){return e(r,!1)}function n(r){return e(r,!0)}function o(r,e,t){for(var n=0,o=0,i=null;;){var a=r.indexOf("\n",n);if(-1===a){if(!(e&&n<r.length))break;a=r.length-1}var f=r.slice(n,a+1),c={};try{c=this.parse(f)}catch(r){r instanceof Error&&(i=r)}if(i)break;t.enqueue(this.objectMode?c:JSON.stringify(c)),o=n=a+1}this.buffer=r.slice(o),i&&t.error(i)}function i(r){void 0===r&&(r={objectMode:!1,strict:!1});var e=r.objectMode,i=r.strict,a={buffer:"",objectMode:void 0!==e&&e,parse:void 0!==i&&i?n:t};return{transform:function(r,e){o.call(a,a.buffer+r,!1,e)},flush:function(r){o.call(a,a.buffer,!0,r)}}}exports.LtsvToJsonStream=i,exports.createLtsvToJsonStream=function(r){return new TransformStream(i(r))};
//# sourceMappingURL=ltsv.js.map
