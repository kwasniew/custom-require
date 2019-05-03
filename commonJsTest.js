var originalRequire = require;
var assert = originalRequire('assert');
var fs = originalRequire('fs');
var path = originalRequire('path');

function loadModule(filename, module, require) {
    // require is sync
    // loading + wrapping
    // in real require there's also __dirname and __filename injected
    var wrappedSrc =
        '(function(module, exports, require) {' +
        fs.readFileSync(filename, 'utf8') +
        '})(module, module.exports, require);';

    eval(wrappedSrc);
}

// https://hackernoon.com/node-js-tc-39-and-modules-a1118aecf95e#.8h8dpwxtu
// resolution -> loading -> wrapping -> evaluation -> caching
var require = function (moduleName) {
    // resolution
    var id = require.resolve(moduleName);
    // modules are cached singletons
    if (require.cache[id]) {
        return require.cache[id].exports;
    }

    var module = {
        // exports is just a regular JS object
        exports: {},
        id: id
    };

    // loading + wrapping + evaluation
    loadModule(id, module, require);

    // caching
    require.cache[id] = module;

    return module.exports;
};
require.cache = {};

require.resolve = function (moduleName) {
    // real algorithm is much more complicated (file modules, core modules, package modules)
    // originalRequire.resolve() can be used directly
    return path.normalize(__dirname +'/'+ moduleName);
};

console.log(require('./main')());
