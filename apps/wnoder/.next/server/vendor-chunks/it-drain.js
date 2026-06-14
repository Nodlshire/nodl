"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-drain";
exports.ids = ["vendor-chunks/it-drain"];
exports.modules = {

/***/ "(ssr)/../../node_modules/it-drain/dist/src/index.js":
/*!*****************************************************!*\
  !*** ../../node_modules/it-drain/dist/src/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/**\n * @packageDocumentation\n *\n * Mostly useful for tests or when you want to be explicit about consuming an iterable without doing anything with any yielded values.\n *\n * @example\n *\n * ```javascript\n * import drain from 'it-drain'\n *\n * // This can also be an iterator, generator, etc\n * const values = [0, 1, 2, 3, 4]\n *\n * drain(values)\n * ```\n *\n * Async sources must be awaited:\n *\n * ```javascript\n * import drain from 'it-drain'\n *\n * const values = async function * {\n *   yield * [0, 1, 2, 3, 4]\n * }\n *\n * await drain(values())\n * ```\n */\nfunction isAsyncIterable(thing) {\n    return thing[Symbol.asyncIterator] != null;\n}\nfunction drain(source) {\n    if (isAsyncIterable(source)) {\n        return (async () => {\n            for await (const _ of source) { } // eslint-disable-line no-empty,@typescript-eslint/no-unused-vars\n        })();\n    }\n    else {\n        for (const _ of source) { } // eslint-disable-line no-empty,@typescript-eslint/no-unused-vars\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (drain);\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2l0LWRyYWluL2Rpc3Qvc3JjL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0EsaUVBQWUsS0FBSyxFQUFDO0FBQ3JCIiwic291cmNlcyI6WyIvaG9tZS9vYnJlZ2FuL0RvY3VtZW50cy9ub2RsL25vZGVfbW9kdWxlcy9pdC1kcmFpbi9kaXN0L3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIE1vc3RseSB1c2VmdWwgZm9yIHRlc3RzIG9yIHdoZW4geW91IHdhbnQgdG8gYmUgZXhwbGljaXQgYWJvdXQgY29uc3VtaW5nIGFuIGl0ZXJhYmxlIHdpdGhvdXQgZG9pbmcgYW55dGhpbmcgd2l0aCBhbnkgeWllbGRlZCB2YWx1ZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgZHJhaW4gZnJvbSAnaXQtZHJhaW4nXG4gKlxuICogLy8gVGhpcyBjYW4gYWxzbyBiZSBhbiBpdGVyYXRvciwgZ2VuZXJhdG9yLCBldGNcbiAqIGNvbnN0IHZhbHVlcyA9IFswLCAxLCAyLCAzLCA0XVxuICpcbiAqIGRyYWluKHZhbHVlcylcbiAqIGBgYFxuICpcbiAqIEFzeW5jIHNvdXJjZXMgbXVzdCBiZSBhd2FpdGVkOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCBkcmFpbiBmcm9tICdpdC1kcmFpbidcbiAqXG4gKiBjb25zdCB2YWx1ZXMgPSBhc3luYyBmdW5jdGlvbiAqIHtcbiAqICAgeWllbGQgKiBbMCwgMSwgMiwgMywgNF1cbiAqIH1cbiAqXG4gKiBhd2FpdCBkcmFpbih2YWx1ZXMoKSlcbiAqIGBgYFxuICovXG5mdW5jdGlvbiBpc0FzeW5jSXRlcmFibGUodGhpbmcpIHtcbiAgICByZXR1cm4gdGhpbmdbU3ltYm9sLmFzeW5jSXRlcmF0b3JdICE9IG51bGw7XG59XG5mdW5jdGlvbiBkcmFpbihzb3VyY2UpIHtcbiAgICBpZiAoaXNBc3luY0l0ZXJhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IF8gb2Ygc291cmNlKSB7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eSxAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAgICAgfSkoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgXyBvZiBzb3VyY2UpIHsgfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVtcHR5LEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IGRyYWluO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/it-drain/dist/src/index.js\n");

/***/ })

};
;