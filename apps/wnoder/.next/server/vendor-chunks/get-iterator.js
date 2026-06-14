"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/get-iterator";
exports.ids = ["vendor-chunks/get-iterator"];
exports.modules = {

/***/ "(ssr)/../../node_modules/get-iterator/dist/src/index.js":
/*!*********************************************************!*\
  !*** ../../node_modules/get-iterator/dist/src/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getIterator: () => (/* binding */ getIterator)\n/* harmony export */ });\nfunction getIterator(obj) {\n    if (obj != null) {\n        if (typeof obj[Symbol.iterator] === 'function') {\n            return obj[Symbol.iterator]();\n        }\n        if (typeof obj[Symbol.asyncIterator] === 'function') {\n            return obj[Symbol.asyncIterator]();\n        }\n        if (typeof obj.next === 'function') {\n            return obj; // probably an iterator\n        }\n    }\n    throw new Error('argument is not an iterator or iterable');\n}\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2dldC1pdGVyYXRvci9kaXN0L3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL29icmVnYW4vRG9jdW1lbnRzL25vZGwvbm9kZV9tb2R1bGVzL2dldC1pdGVyYXRvci9kaXN0L3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0SXRlcmF0b3Iob2JqKSB7XG4gICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG9ialtTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG9iai5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqOyAvLyBwcm9iYWJseSBhbiBpdGVyYXRvclxuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignYXJndW1lbnQgaXMgbm90IGFuIGl0ZXJhdG9yIG9yIGl0ZXJhYmxlJyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/get-iterator/dist/src/index.js\n");

/***/ })

};
;