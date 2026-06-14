"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/abort-error";
exports.ids = ["vendor-chunks/abort-error"];
exports.modules = {

/***/ "(ssr)/../../node_modules/abort-error/dist/src/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/abort-error/dist/src/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AbortError: () => (/* binding */ AbortError)\n/* harmony export */ });\n/**\n * @packageDocumentation\n *\n * A simple error class and options interface that seems to get copied from\n * project to project.\n *\n * @example Using `AbortError`\n *\n * ```JavaScript\n * import { AbortError } from 'abort-error'\n *\n * // a promise that will be settled later\n * const deferred = Promise.withResolvers()\n *\n * const signal = AbortSignal.timeout(1000)\n * signal.addEventListener('abort', () => {\n *   deferred.reject(new AbortError())\n * })\n * ```\n *\n * @example Using `AbortOptions`\n *\n * ```TypeScript\n * import type { AbortOptions } from 'abort-error'\n *\n * async function myFunction (options?: AbortOptions) {\n *   return fetch('https://example.com', {\n *     signal: options?.signal\n *   })\n * }\n * ```\n */\nclass AbortError extends Error {\n    static name = 'AbortError';\n    name = 'AbortError';\n    constructor(message = 'The operation was aborted', ...rest) {\n        super(message, ...rest);\n    }\n}\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2Fib3J0LWVycm9yL2Rpc3Qvc3JjL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGFBQWE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL29icmVnYW4vRG9jdW1lbnRzL25vZGwvbm9kZV9tb2R1bGVzL2Fib3J0LWVycm9yL2Rpc3Qvc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQSBzaW1wbGUgZXJyb3IgY2xhc3MgYW5kIG9wdGlvbnMgaW50ZXJmYWNlIHRoYXQgc2VlbXMgdG8gZ2V0IGNvcGllZCBmcm9tXG4gKiBwcm9qZWN0IHRvIHByb2plY3QuXG4gKlxuICogQGV4YW1wbGUgVXNpbmcgYEFib3J0RXJyb3JgXG4gKlxuICogYGBgSmF2YVNjcmlwdFxuICogaW1wb3J0IHsgQWJvcnRFcnJvciB9IGZyb20gJ2Fib3J0LWVycm9yJ1xuICpcbiAqIC8vIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgc2V0dGxlZCBsYXRlclxuICogY29uc3QgZGVmZXJyZWQgPSBQcm9taXNlLndpdGhSZXNvbHZlcnMoKVxuICpcbiAqIGNvbnN0IHNpZ25hbCA9IEFib3J0U2lnbmFsLnRpbWVvdXQoMTAwMClcbiAqIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsICgpID0+IHtcbiAqICAgZGVmZXJyZWQucmVqZWN0KG5ldyBBYm9ydEVycm9yKCkpXG4gKiB9KVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgVXNpbmcgYEFib3J0T3B0aW9uc2BcbiAqXG4gKiBgYGBUeXBlU2NyaXB0XG4gKiBpbXBvcnQgdHlwZSB7IEFib3J0T3B0aW9ucyB9IGZyb20gJ2Fib3J0LWVycm9yJ1xuICpcbiAqIGFzeW5jIGZ1bmN0aW9uIG15RnVuY3Rpb24gKG9wdGlvbnM/OiBBYm9ydE9wdGlvbnMpIHtcbiAqICAgcmV0dXJuIGZldGNoKCdodHRwczovL2V4YW1wbGUuY29tJywge1xuICogICAgIHNpZ25hbDogb3B0aW9ucz8uc2lnbmFsXG4gKiAgIH0pXG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEFib3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgc3RhdGljIG5hbWUgPSAnQWJvcnRFcnJvcic7XG4gICAgbmFtZSA9ICdBYm9ydEVycm9yJztcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ1RoZSBvcGVyYXRpb24gd2FzIGFib3J0ZWQnLCAuLi5yZXN0KSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UsIC4uLnJlc3QpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/abort-error/dist/src/index.js\n");

/***/ })

};
;