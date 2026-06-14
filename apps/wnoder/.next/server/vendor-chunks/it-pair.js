"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-pair";
exports.ids = ["vendor-chunks/it-pair"];
exports.modules = {

/***/ "(ssr)/../../node_modules/it-pair/dist/src/duplex.js":
/*!*****************************************************!*\
  !*** ../../node_modules/it-pair/dist/src/duplex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   duplexPair: () => (/* binding */ duplexPair)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"(ssr)/../../node_modules/it-pair/dist/src/index.js\");\n\n/**\n * Two duplex streams that are attached to each other\n */\nfunction duplexPair() {\n    const a = (0,_index_js__WEBPACK_IMPORTED_MODULE_0__.pair)();\n    const b = (0,_index_js__WEBPACK_IMPORTED_MODULE_0__.pair)();\n    return [\n        {\n            source: a.source,\n            sink: b.sink\n        },\n        {\n            source: b.source,\n            sink: a.sink\n        }\n    ];\n}\n//# sourceMappingURL=duplex.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2l0LXBhaXIvZGlzdC9zcmMvZHVwbGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsY0FBYywrQ0FBSTtBQUNsQixjQUFjLCtDQUFJO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvaG9tZS9vYnJlZ2FuL0RvY3VtZW50cy9ub2RsL25vZGVfbW9kdWxlcy9pdC1wYWlyL2Rpc3Qvc3JjL2R1cGxleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwYWlyIH0gZnJvbSAnLi9pbmRleC5qcyc7XG4vKipcbiAqIFR3byBkdXBsZXggc3RyZWFtcyB0aGF0IGFyZSBhdHRhY2hlZCB0byBlYWNoIG90aGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkdXBsZXhQYWlyKCkge1xuICAgIGNvbnN0IGEgPSBwYWlyKCk7XG4gICAgY29uc3QgYiA9IHBhaXIoKTtcbiAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgICBzb3VyY2U6IGEuc291cmNlLFxuICAgICAgICAgICAgc2luazogYi5zaW5rXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNvdXJjZTogYi5zb3VyY2UsXG4gICAgICAgICAgICBzaW5rOiBhLnNpbmtcbiAgICAgICAgfVxuICAgIF07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kdXBsZXguanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/it-pair/dist/src/duplex.js\n");

/***/ }),

/***/ "(ssr)/../../node_modules/it-pair/dist/src/index.js":
/*!****************************************************!*\
  !*** ../../node_modules/it-pair/dist/src/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pair: () => (/* binding */ pair)\n/* harmony export */ });\n/* harmony import */ var p_defer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p-defer */ \"(ssr)/../../node_modules/p-defer/index.js\");\n\n/**\n * A pair of streams where one drains from the other\n */\nfunction pair() {\n    const deferred = (0,p_defer__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n    let piped = false;\n    return {\n        sink: async (source) => {\n            if (piped) {\n                throw new Error('already piped');\n            }\n            piped = true;\n            deferred.resolve(source);\n        },\n        source: (async function* () {\n            const source = await deferred.promise;\n            yield* source;\n        }())\n    };\n}\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2l0LXBhaXIvZGlzdC9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ087QUFDUCxxQkFBcUIsbURBQUs7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvaG9tZS9vYnJlZ2FuL0RvY3VtZW50cy9ub2RsL25vZGVfbW9kdWxlcy9pdC1wYWlyL2Rpc3Qvc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWZlciBmcm9tICdwLWRlZmVyJztcbi8qKlxuICogQSBwYWlyIG9mIHN0cmVhbXMgd2hlcmUgb25lIGRyYWlucyBmcm9tIHRoZSBvdGhlclxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFpcigpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgbGV0IHBpcGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2luazogYXN5bmMgKHNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHBpcGVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhbHJlYWR5IHBpcGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwaXBlZCA9IHRydWU7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZTogKGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBhd2FpdCBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgeWllbGQqIHNvdXJjZTtcbiAgICAgICAgfSgpKVxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/it-pair/dist/src/index.js\n");

/***/ })

};
;