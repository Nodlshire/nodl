"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/progress-events";
exports.ids = ["vendor-chunks/progress-events"];
exports.modules = {

/***/ "(ssr)/../../node_modules/progress-events/dist/src/index.js":
/*!************************************************************!*\
  !*** ../../node_modules/progress-events/dist/src/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CustomProgressEvent: () => (/* binding */ CustomProgressEvent)\n/* harmony export */ });\n/**\n * An implementation of the ProgressEvent interface, this is essentially\n * a typed `CustomEvent` with a `type` property that lets us disambiguate\n * events passed to `progress` callbacks.\n */\nclass CustomProgressEvent extends Event {\n    type;\n    detail;\n    constructor(type, detail) {\n        super(type);\n        this.type = type;\n        // @ts-expect-error detail may be undefined\n        this.detail = detail;\n    }\n}\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2dyZXNzLWV2ZW50cy9kaXN0L3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL29icmVnYW4vRG9jdW1lbnRzL25vZGwvbm9kZV9tb2R1bGVzL3Byb2dyZXNzLWV2ZW50cy9kaXN0L3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBQcm9ncmVzc0V2ZW50IGludGVyZmFjZSwgdGhpcyBpcyBlc3NlbnRpYWxseVxuICogYSB0eXBlZCBgQ3VzdG9tRXZlbnRgIHdpdGggYSBgdHlwZWAgcHJvcGVydHkgdGhhdCBsZXRzIHVzIGRpc2FtYmlndWF0ZVxuICogZXZlbnRzIHBhc3NlZCB0byBgcHJvZ3Jlc3NgIGNhbGxiYWNrcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEN1c3RvbVByb2dyZXNzRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gICAgdHlwZTtcbiAgICBkZXRhaWw7XG4gICAgY29uc3RydWN0b3IodHlwZSwgZGV0YWlsKSB7XG4gICAgICAgIHN1cGVyKHR5cGUpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGRldGFpbCBtYXkgYmUgdW5kZWZpbmVkXG4gICAgICAgIHRoaXMuZGV0YWlsID0gZGV0YWlsO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/progress-events/dist/src/index.js\n");

/***/ })

};
;