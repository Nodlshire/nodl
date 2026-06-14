"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-all";
exports.ids = ["vendor-chunks/it-all"];
exports.modules = {

/***/ "(ssr)/../../node_modules/it-all/dist/src/index.js":
/*!***************************************************!*\
  !*** ../../node_modules/it-all/dist/src/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/**\n * @packageDocumentation\n *\n * For when you need a one-liner to collect iterable values.\n *\n * @example\n *\n * ```javascript\n * import all from 'it-all'\n *\n * // This can also be an iterator, etc\n * const values = function * () {\n *   yield * [0, 1, 2, 3, 4]\n * }\n *\n * const arr = all(values)\n *\n * console.info(arr) // 0, 1, 2, 3, 4\n * ```\n *\n * Async sources must be awaited:\n *\n * ```javascript\n * const values = async function * () {\n *   yield * [0, 1, 2, 3, 4]\n * }\n *\n * const arr = await all(values())\n *\n * console.info(arr) // 0, 1, 2, 3, 4\n * ```\n */\nfunction isAsyncIterable(thing) {\n    return thing[Symbol.asyncIterator] != null;\n}\nfunction all(source) {\n    if (isAsyncIterable(source)) {\n        return (async () => {\n            const arr = [];\n            for await (const entry of source) {\n                arr.push(entry);\n            }\n            return arr;\n        })();\n    }\n    const arr = [];\n    for (const entry of source) {\n        arr.push(entry);\n    }\n    return arr;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (all);\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2l0LWFsbC9kaXN0L3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxHQUFHLEVBQUM7QUFDbkIiLCJzb3VyY2VzIjpbIi9ob21lL29icmVnYW4vRG9jdW1lbnRzL25vZGwvbm9kZV9tb2R1bGVzL2l0LWFsbC9kaXN0L3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIEZvciB3aGVuIHlvdSBuZWVkIGEgb25lLWxpbmVyIHRvIGNvbGxlY3QgaXRlcmFibGUgdmFsdWVzLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IGFsbCBmcm9tICdpdC1hbGwnXG4gKlxuICogLy8gVGhpcyBjYW4gYWxzbyBiZSBhbiBpdGVyYXRvciwgZXRjXG4gKiBjb25zdCB2YWx1ZXMgPSBmdW5jdGlvbiAqICgpIHtcbiAqICAgeWllbGQgKiBbMCwgMSwgMiwgMywgNF1cbiAqIH1cbiAqXG4gKiBjb25zdCBhcnIgPSBhbGwodmFsdWVzKVxuICpcbiAqIGNvbnNvbGUuaW5mbyhhcnIpIC8vIDAsIDEsIDIsIDMsIDRcbiAqIGBgYFxuICpcbiAqIEFzeW5jIHNvdXJjZXMgbXVzdCBiZSBhd2FpdGVkOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHZhbHVlcyA9IGFzeW5jIGZ1bmN0aW9uICogKCkge1xuICogICB5aWVsZCAqIFswLCAxLCAyLCAzLCA0XVxuICogfVxuICpcbiAqIGNvbnN0IGFyciA9IGF3YWl0IGFsbCh2YWx1ZXMoKSlcbiAqXG4gKiBjb25zb2xlLmluZm8oYXJyKSAvLyAwLCAxLCAyLCAzLCA0XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gaXNBc3luY0l0ZXJhYmxlKHRoaW5nKSB7XG4gICAgcmV0dXJuIHRoaW5nW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSAhPSBudWxsO1xufVxuZnVuY3Rpb24gYWxsKHNvdXJjZSkge1xuICAgIGlmIChpc0FzeW5jSXRlcmFibGUoc291cmNlKSkge1xuICAgICAgICByZXR1cm4gKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaChlbnRyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgICB9KSgpO1xuICAgIH1cbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHNvdXJjZSkge1xuICAgICAgICBhcnIucHVzaChlbnRyeSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5leHBvcnQgZGVmYXVsdCBhbGw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/it-all/dist/src/index.js\n");

/***/ })

};
;