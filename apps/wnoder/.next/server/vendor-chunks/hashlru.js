/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/hashlru";
exports.ids = ["vendor-chunks/hashlru"];
exports.modules = {

/***/ "(ssr)/../../node_modules/hashlru/index.js":
/*!*******************************************!*\
  !*** ../../node_modules/hashlru/index.js ***!
  \*******************************************/
/***/ ((module) => {

eval("module.exports = function (max) {\n\n  if (!max) throw Error('hashlru must have a max value, of type number, greater than 0')\n\n  var size = 0, cache = Object.create(null), _cache = Object.create(null)\n\n  function update (key, value) {\n    cache[key] = value\n    size ++\n    if(size >= max) {\n      size = 0\n      _cache = cache\n      cache = Object.create(null)\n    }\n  }\n\n  return {\n    has: function (key) {\n      return cache[key] !== undefined || _cache[key] !== undefined\n    },\n    remove: function (key) {\n      if(cache[key] !== undefined)\n        cache[key] = undefined\n      if(_cache[key] !== undefined)\n        _cache[key] = undefined\n    },\n    get: function (key) {\n      var v = cache[key]\n      if(v !== undefined) return v\n      if((v = _cache[key]) !== undefined) {\n        update(key, v)\n        return v\n      }\n    },\n    set: function (key, value) {\n      if(cache[key] !== undefined) cache[key] = value\n      else update(key, value)\n    },\n    clear: function () {\n      cache = Object.create(null)\n      _cache = Object.create(null)\n    }\n  }\n}\n\n\n\n\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2hhc2hscnUvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL29icmVnYW4vRG9jdW1lbnRzL25vZGwvbm9kZV9tb2R1bGVzL2hhc2hscnUvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWF4KSB7XG5cbiAgaWYgKCFtYXgpIHRocm93IEVycm9yKCdoYXNobHJ1IG11c3QgaGF2ZSBhIG1heCB2YWx1ZSwgb2YgdHlwZSBudW1iZXIsIGdyZWF0ZXIgdGhhbiAwJylcblxuICB2YXIgc2l6ZSA9IDAsIGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKSwgX2NhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSAoa2V5LCB2YWx1ZSkge1xuICAgIGNhY2hlW2tleV0gPSB2YWx1ZVxuICAgIHNpemUgKytcbiAgICBpZihzaXplID49IG1heCkge1xuICAgICAgc2l6ZSA9IDBcbiAgICAgIF9jYWNoZSA9IGNhY2hlXG4gICAgICBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGhhczogZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIGNhY2hlW2tleV0gIT09IHVuZGVmaW5lZCB8fCBfY2FjaGVba2V5XSAhPT0gdW5kZWZpbmVkXG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmKGNhY2hlW2tleV0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgY2FjaGVba2V5XSA9IHVuZGVmaW5lZFxuICAgICAgaWYoX2NhY2hlW2tleV0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgX2NhY2hlW2tleV0gPSB1bmRlZmluZWRcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHYgPSBjYWNoZVtrZXldXG4gICAgICBpZih2ICE9PSB1bmRlZmluZWQpIHJldHVybiB2XG4gICAgICBpZigodiA9IF9jYWNoZVtrZXldKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHVwZGF0ZShrZXksIHYpXG4gICAgICAgIHJldHVybiB2XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZihjYWNoZVtrZXldICE9PSB1bmRlZmluZWQpIGNhY2hlW2tleV0gPSB2YWx1ZVxuICAgICAgZWxzZSB1cGRhdGUoa2V5LCB2YWx1ZSlcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgIF9jYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB9XG4gIH1cbn1cblxuXG5cblxuXG5cblxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/hashlru/index.js\n");

/***/ })

};
;