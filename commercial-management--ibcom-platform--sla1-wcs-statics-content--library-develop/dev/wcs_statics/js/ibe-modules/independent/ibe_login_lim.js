/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/core-js/internals/a-callable.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ },

/***/ "./node_modules/core-js/internals/a-constructor.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/a-constructor.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ },

/***/ "./node_modules/core-js/internals/a-possible-prototype.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ },

/***/ "./node_modules/core-js/internals/add-to-unscopables.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ },

/***/ "./node_modules/core-js/internals/advance-string-index.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/advance-string-index.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js").charAt);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ },

/***/ "./node_modules/core-js/internals/an-instance.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/an-instance.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};


/***/ },

/***/ "./node_modules/core-js/internals/an-object.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ },

/***/ "./node_modules/core-js/internals/array-buffer-basic-detection.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-basic-detection.js ***!
  \************************************************************************/
(module) {

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ },

/***/ "./node_modules/core-js/internals/array-buffer-view-core.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-view-core.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(/*! ../internals/array-buffer-basic-detection */ "./node_modules/core-js/internals/array-buffer-basic-detection.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ },

/***/ "./node_modules/core-js/internals/array-buffer.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var NATIVE_ARRAY_BUFFER = __webpack_require__(/*! ../internals/array-buffer-basic-detection */ "./node_modules/core-js/internals/array-buffer-basic-detection.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toIndex = __webpack_require__(/*! ../internals/to-index */ "./node_modules/core-js/internals/to-index.js");
var IEEE754 = __webpack_require__(/*! ../internals/ieee754 */ "./node_modules/core-js/internals/ieee754.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var getOwnPropertyNames = (__webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js").f);
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var arrayFill = __webpack_require__(/*! ../internals/array-fill */ "./node_modules/core-js/internals/array-fill.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "./node_modules/core-js/internals/array-slice-simple.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
var $DataView = global[DATA_VIEW];
var DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype = Object.prototype;
var Array = global.Array;
var RangeError = global.RangeError;
var fill = uncurryThis(arrayFill);
var reverse = uncurryThis([].reverse);

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = arraySlice(bytes, start, start + count);
  return isLittleEndian ? pack : reverse(pack);
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, ArrayBufferPrototype);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: fill(Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, DataViewPrototype);
    anInstance(buffer, ArrayBufferPrototype);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toIntegerOrInfinity(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  DataViewPrototype = $DataView[PROTOTYPE];

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  defineBuiltIns(DataViewPrototype, {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME && NativeArrayBuffer.name !== ARRAY_BUFFER;
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return NativeArrayBuffer.length != 1 || INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
  })) {
    /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, ArrayBufferPrototype);
      return new NativeArrayBuffer(toIndex(length));
    };

    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;

    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }

    ArrayBufferPrototype.constructor = $ArrayBuffer;
  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
    createNonEnumerableProperty(NativeArrayBuffer, 'name', ARRAY_BUFFER);
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (setPrototypeOf && getPrototypeOf(DataViewPrototype) !== ObjectPrototype) {
    setPrototypeOf(DataViewPrototype, ObjectPrototype);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = uncurryThis(DataViewPrototype.setInt8);
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) defineBuiltIns(DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

module.exports = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};


/***/ },

/***/ "./node_modules/core-js/internals/array-fill.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-fill.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = lengthOfArrayLike(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ },

/***/ "./node_modules/core-js/internals/array-from-constructor-and-list.js"
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-from-constructor-and-list.js ***!
  \***************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

module.exports = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};


/***/ },

/***/ "./node_modules/core-js/internals/array-includes.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ },

/***/ "./node_modules/core-js/internals/array-iteration-from-last.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration-from-last.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_FIND_LAST_INDEX = TYPE == 1;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var index = lengthOfArrayLike(self);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0: return value; // findLast
        case 1: return index; // findLastIndex
      }
    }
    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};

module.exports = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod(1)
};


/***/ },

/***/ "./node_modules/core-js/internals/array-iteration.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ },

/***/ "./node_modules/core-js/internals/array-set-length.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/array-set-length.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ },

/***/ "./node_modules/core-js/internals/array-slice-simple.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice-simple.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");

var $Array = Array;
var max = Math.max;

module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};


/***/ },

/***/ "./node_modules/core-js/internals/array-slice.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ },

/***/ "./node_modules/core-js/internals/array-sort.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-sort.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "./node_modules/core-js/internals/array-slice-simple.js");

var floor = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    array,
    mergeSort(arraySlice(array, 0, middle), comparefn),
    mergeSort(arraySlice(array, middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;

  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = (lindex < llength && rindex < rlength)
      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
      : lindex < llength ? left[lindex++] : right[rindex++];
  } return array;
};

module.exports = mergeSort;


/***/ },

/***/ "./node_modules/core-js/internals/array-species-constructor.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ },

/***/ "./node_modules/core-js/internals/array-species-create.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ },

/***/ "./node_modules/core-js/internals/array-to-reversed.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/array-to-reversed.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
module.exports = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};


/***/ },

/***/ "./node_modules/core-js/internals/array-with.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-with.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var $RangeError = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
module.exports = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw $RangeError('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};


/***/ },

/***/ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js"
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/call-with-safe-iteration-closing.js ***!
  \****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/check-correctness-of-iteration.js"
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/check-correctness-of-iteration.js ***!
  \**************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ },

/***/ "./node_modules/core-js/internals/classof-raw.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ },

/***/ "./node_modules/core-js/internals/classof.js"
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ },

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ },

/***/ "./node_modules/core-js/internals/create-iter-result-object.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iter-result-object.js ***!
  \*********************************************************************/
(module) {

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ },

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js"
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ },

/***/ "./node_modules/core-js/internals/create-property-descriptor.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ },

/***/ "./node_modules/core-js/internals/create-property.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ },

/***/ "./node_modules/core-js/internals/define-built-in-accessor.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in-accessor.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ },

/***/ "./node_modules/core-js/internals/define-built-in.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ },

/***/ "./node_modules/core-js/internals/define-built-ins.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-ins.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};


/***/ },

/***/ "./node_modules/core-js/internals/define-global-property.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ },

/***/ "./node_modules/core-js/internals/descriptors.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ },

/***/ "./node_modules/core-js/internals/document-all.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/document-all.js ***!
  \********************************************************/
(module) {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ },

/***/ "./node_modules/core-js/internals/document-create-element.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ },

/***/ "./node_modules/core-js/internals/does-not-exceed-safe-integer.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/does-not-exceed-safe-integer.js ***!
  \************************************************************************/
(module) {

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ },

/***/ "./node_modules/core-js/internals/dom-exception-constants.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-exception-constants.js ***!
  \*******************************************************************/
(module) {

module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};


/***/ },

/***/ "./node_modules/core-js/internals/dom-iterables.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
(module) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ },

/***/ "./node_modules/core-js/internals/dom-token-list-prototype.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-token-list-prototype.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ },

/***/ "./node_modules/core-js/internals/engine-ff-version.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-ff-version.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ },

/***/ "./node_modules/core-js/internals/engine-is-ie-or-edge.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-is-ie-or-edge.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var UA = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

module.exports = /MSIE|Trident/.test(UA);


/***/ },

/***/ "./node_modules/core-js/internals/engine-user-agent.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ },

/***/ "./node_modules/core-js/internals/engine-v8-version.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ },

/***/ "./node_modules/core-js/internals/engine-webkit-version.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-webkit-version.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ },

/***/ "./node_modules/core-js/internals/enum-bug-keys.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ },

/***/ "./node_modules/core-js/internals/error-stack-clear.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/error-stack-clear.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ },

/***/ "./node_modules/core-js/internals/error-stack-installable.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/error-stack-installable.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ },

/***/ "./node_modules/core-js/internals/export.js"
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/fails.js"
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js"
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js ***!
  \******************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(/*! ../modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};


/***/ },

/***/ "./node_modules/core-js/internals/function-apply.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/function-apply.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ },

/***/ "./node_modules/core-js/internals/function-bind-context.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ },

/***/ "./node_modules/core-js/internals/function-bind-native.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ },

/***/ "./node_modules/core-js/internals/function-call.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ },

/***/ "./node_modules/core-js/internals/function-name.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ },

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ },

/***/ "./node_modules/core-js/internals/function-uncurry-this.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ },

/***/ "./node_modules/core-js/internals/get-built-in.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ },

/***/ "./node_modules/core-js/internals/get-iterator-direct.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-direct.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

module.exports = function (obj) {
  return {
    iterator: obj,
    next: aCallable(anObject(obj).next)
  };
};


/***/ },

/***/ "./node_modules/core-js/internals/get-iterator-method.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ },

/***/ "./node_modules/core-js/internals/get-iterator.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ },

/***/ "./node_modules/core-js/internals/get-method.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ },

/***/ "./node_modules/core-js/internals/get-substitution.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/get-substitution.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ },

/***/ "./node_modules/core-js/internals/global.js"
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ },

/***/ "./node_modules/core-js/internals/has-own-property.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ },

/***/ "./node_modules/core-js/internals/hidden-keys.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
(module) {

module.exports = {};


/***/ },

/***/ "./node_modules/core-js/internals/html.js"
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ },

/***/ "./node_modules/core-js/internals/ie8-dom-define.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ },

/***/ "./node_modules/core-js/internals/ieee754.js"
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/ieee754.js ***!
  \***************************************************/
(module) {

// IEEE754 conversions based on https://github.com/feross/ieee754
var $Array = Array;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = $Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    c = pow(2, -exponent);
    if (number * c < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  while (mantissaLength >= 8) {
    buffer[index++] = mantissa & 255;
    mantissa /= 256;
    mantissaLength -= 8;
  }
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  while (exponentLength > 0) {
    buffer[index++] = exponent & 255;
    exponent /= 256;
    exponentLength -= 8;
  }
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  while (nBits > 0) {
    exponent = exponent * 256 + buffer[index--];
    nBits -= 8;
  }
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  while (nBits > 0) {
    mantissa = mantissa * 256 + buffer[index--];
    nBits -= 8;
  }
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

module.exports = {
  pack: pack,
  unpack: unpack
};


/***/ },

/***/ "./node_modules/core-js/internals/indexed-object.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ },

/***/ "./node_modules/core-js/internals/inherit-if-required.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/inherit-if-required.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ },

/***/ "./node_modules/core-js/internals/inspect-source.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ },

/***/ "./node_modules/core-js/internals/install-error-cause.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/install-error-cause.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/internal-state.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ },

/***/ "./node_modules/core-js/internals/is-array-iterator-method.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ },

/***/ "./node_modules/core-js/internals/is-array.js"
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ },

/***/ "./node_modules/core-js/internals/is-big-int-array.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/is-big-int-array.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var slice = uncurryThis(''.slice);

module.exports = function (it) {
  return slice(classof(it), 0, 3) === 'Big';
};


/***/ },

/***/ "./node_modules/core-js/internals/is-callable.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ },

/***/ "./node_modules/core-js/internals/is-constructor.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ },

/***/ "./node_modules/core-js/internals/is-forced.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ },

/***/ "./node_modules/core-js/internals/is-integral-number.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/is-integral-number.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var floor = Math.floor;

// `IsIntegralNumber` abstract operation
// https://tc39.es/ecma262/#sec-isintegralnumber
// eslint-disable-next-line es/no-number-isinteger -- safe
module.exports = Number.isInteger || function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ },

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
(module) {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ },

/***/ "./node_modules/core-js/internals/is-object.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ },

/***/ "./node_modules/core-js/internals/is-pure.js"
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
(module) {

module.exports = false;


/***/ },

/***/ "./node_modules/core-js/internals/is-symbol.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ },

/***/ "./node_modules/core-js/internals/iterate.js"
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/iterate.js ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ },

/***/ "./node_modules/core-js/internals/iterator-close.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-close.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ },

/***/ "./node_modules/core-js/internals/iterator-create-constructor.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-create-constructor.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ },

/***/ "./node_modules/core-js/internals/iterator-create-proxy.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-create-proxy.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

var ITERATOR_HELPER = 'IteratorHelper';
var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
var setInternalState = InternalStateModule.set;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var createIteratorProxyPrototype = function (IS_ITERATOR) {
  var ITERATOR_PROXY = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;

  var getInternalState = InternalStateModule.getterFor(ITERATOR_PROXY);

  var IteratorProxyPrototype = defineBuiltIns(create(IteratorPrototype), {
    next: function next() {
      var state = getInternalState(this);
      // for simplification:
      //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
      //   for `%IteratorHelperPrototype%.next` - just a value
      if (IS_ITERATOR) return state.nextHandler();
      try {
        var result = state.done ? undefined : state.nextHandler();
        return createIterResultObject(result, state.done);
      } catch (error) {
        state.done = true;
        throw error;
      }
    },
    'return': function () {
      var state = getInternalState(this);
      var iterator = state.iterator;
      state.done = true;
      if (IS_ITERATOR) {
        var returnMethod = getMethod(iterator, 'return');
        return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
      }
      if (state.inner) try {
        iteratorClose(state.inner.iterator, 'return');
      } catch (error) {
        return iteratorClose(iterator, 'throw', error);
      }
      iteratorClose(iterator, 'return');
      return createIterResultObject(undefined, true);
    }
  });

  if (!IS_ITERATOR) {
    createNonEnumerableProperty(IteratorProxyPrototype, TO_STRING_TAG, 'Iterator Helper');
  }

  return IteratorProxyPrototype;
};

var IteratorHelperPrototype = createIteratorProxyPrototype(false);
var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);

module.exports = function (nextHandler, IS_ITERATOR) {
  var ITERATOR_PROXY = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;

  var IteratorProxy = function Iterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = ITERATOR_PROXY;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };

  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

  return IteratorProxy;
};


/***/ },

/***/ "./node_modules/core-js/internals/iterator-define.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-define.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js/internals/iterator-create-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ },

/***/ "./node_modules/core-js/internals/iterators-core.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ },

/***/ "./node_modules/core-js/internals/iterators.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
(module) {

module.exports = {};


/***/ },

/***/ "./node_modules/core-js/internals/length-of-array-like.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ },

/***/ "./node_modules/core-js/internals/make-built-in.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ },

/***/ "./node_modules/core-js/internals/math-trunc.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ },

/***/ "./node_modules/core-js/internals/normalize-string-argument.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/normalize-string-argument.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ },

/***/ "./node_modules/core-js/internals/object-create.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ },

/***/ "./node_modules/core-js/internals/object-define-properties.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ },

/***/ "./node_modules/core-js/internals/object-define-property.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ },

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ },

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ },

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js"
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
(__unused_webpack_module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ },

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ },

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ },

/***/ "./node_modules/core-js/internals/object-keys-internal.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ },

/***/ "./node_modules/core-js/internals/object-keys.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ },

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ },

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ },

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ },

/***/ "./node_modules/core-js/internals/own-keys.js"
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ },

/***/ "./node_modules/core-js/internals/proxy-accessor.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/proxy-accessor.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


/***/ },

/***/ "./node_modules/core-js/internals/regexp-exec-abstract.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec-abstract.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw $TypeError('RegExp#exec called on incompatible receiver');
};


/***/ },

/***/ "./node_modules/core-js/internals/regexp-exec.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var regexpFlags = __webpack_require__(/*! ../internals/regexp-flags */ "./node_modules/core-js/internals/regexp-flags.js");
var stickyHelpers = __webpack_require__(/*! ../internals/regexp-sticky-helpers */ "./node_modules/core-js/internals/regexp-sticky-helpers.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getInternalState = (__webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js").get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(/*! ../internals/regexp-unsupported-dot-all */ "./node_modules/core-js/internals/regexp-unsupported-dot-all.js");
var UNSUPPORTED_NCG = __webpack_require__(/*! ../internals/regexp-unsupported-ncg */ "./node_modules/core-js/internals/regexp-unsupported-ncg.js");

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ },

/***/ "./node_modules/core-js/internals/regexp-flags.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-flags.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};


/***/ },

/***/ "./node_modules/core-js/internals/regexp-sticky-helpers.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-sticky-helpers.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};


/***/ },

/***/ "./node_modules/core-js/internals/regexp-unsupported-dot-all.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-unsupported-dot-all.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});


/***/ },

/***/ "./node_modules/core-js/internals/regexp-unsupported-ncg.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-unsupported-ncg.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ },

/***/ "./node_modules/core-js/internals/require-object-coercible.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ },

/***/ "./node_modules/core-js/internals/set-species.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/set-species.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/set-to-string-tag.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/shared-key.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ },

/***/ "./node_modules/core-js/internals/shared-store.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ },

/***/ "./node_modules/core-js/internals/shared.js"
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.26.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ },

/***/ "./node_modules/core-js/internals/species-constructor.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/species-constructor.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aConstructor = __webpack_require__(/*! ../internals/a-constructor */ "./node_modules/core-js/internals/a-constructor.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ },

/***/ "./node_modules/core-js/internals/string-multibyte.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/string-multibyte.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ },

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ },

/***/ "./node_modules/core-js/internals/to-absolute-index.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ },

/***/ "./node_modules/core-js/internals/to-big-int.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/to-big-int.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");

var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
};


/***/ },

/***/ "./node_modules/core-js/internals/to-index.js"
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/to-index.js ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

var $RangeError = RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity(it);
  var length = toLength(number);
  if (number !== length) throw $RangeError('Wrong length or index');
  return length;
};


/***/ },

/***/ "./node_modules/core-js/internals/to-indexed-object.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ },

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ },

/***/ "./node_modules/core-js/internals/to-length.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ },

/***/ "./node_modules/core-js/internals/to-object.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ },

/***/ "./node_modules/core-js/internals/to-offset.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-offset.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw $RangeError('Wrong offset');
  return offset;
};


/***/ },

/***/ "./node_modules/core-js/internals/to-positive-integer.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/to-positive-integer.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw $RangeError("The argument can't be less than 0");
  return result;
};


/***/ },

/***/ "./node_modules/core-js/internals/to-primitive.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ },

/***/ "./node_modules/core-js/internals/to-property-key.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ },

/***/ "./node_modules/core-js/internals/to-string-tag-support.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ },

/***/ "./node_modules/core-js/internals/to-string.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ },

/***/ "./node_modules/core-js/internals/try-to-string.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
(module) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ },

/***/ "./node_modules/core-js/internals/typed-array-constructor.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-constructor.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = __webpack_require__(/*! ../internals/typed-array-constructors-require-wrappers */ "./node_modules/core-js/internals/typed-array-constructors-require-wrappers.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var ArrayBufferModule = __webpack_require__(/*! ../internals/array-buffer */ "./node_modules/core-js/internals/array-buffer.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var isIntegralNumber = __webpack_require__(/*! ../internals/is-integral-number */ "./node_modules/core-js/internals/is-integral-number.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toIndex = __webpack_require__(/*! ../internals/to-index */ "./node_modules/core-js/internals/to-index.js");
var toOffset = __webpack_require__(/*! ../internals/to-offset */ "./node_modules/core-js/internals/to-offset.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var getOwnPropertyNames = (__webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js").f);
var typedArrayFrom = __webpack_require__(/*! ../internals/typed-array-from */ "./node_modules/core-js/internals/typed-array-from.js");
var forEach = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach);
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js/internals/set-species.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var enforceInternalState = InternalStateModule.enforce;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError = global.RangeError;
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataView = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore.TypedArray;
var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  aTypedArrayConstructor(C);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return isPrototypeOf(ArrayBufferPrototype, it) || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && !isSymbol(key)
    && key in target
    && isIntegralNumber(+key)
    && key >= 0;
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  key = toPropertyKey(key);
  return isTypedArrayIndex(target, key)
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  key = toPropertyKey(key);
  if (isTypedArrayIndex(target, key)
    && isObject(descriptor)
    && hasOwn(descriptor, 'value')
    && !hasOwn(descriptor, 'get')
    && !hasOwn(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!hasOwn(descriptor, 'writable') || descriptor.writable)
    && (!hasOwn(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (DESCRIPTORS) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  $({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructorPrototype);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return call(typedArrayFrom, TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructorPrototype);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return call(typedArrayFrom, TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    enforceInternalState(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    var FORCED = TypedArrayConstructor != NativeTypedArrayConstructor;

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $({ global: true, constructor: true, forced: FORCED, sham: !NATIVE_ARRAY_BUFFER_VIEWS }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };


/***/ },

/***/ "./node_modules/core-js/internals/typed-array-constructors-require-wrappers.js"
/*!*************************************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-constructors-require-wrappers.js ***!
  \*************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-new -- required for testing */
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");
var NATIVE_ARRAY_BUFFER_VIEWS = (__webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js").NATIVE_ARRAY_BUFFER_VIEWS);

var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});


/***/ },

/***/ "./node_modules/core-js/internals/typed-array-from.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-from.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aConstructor = __webpack_require__(/*! ../internals/a-constructor */ "./node_modules/core-js/internals/a-constructor.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var isBigIntArray = __webpack_require__(/*! ../internals/is-big-int-array */ "./node_modules/core-js/internals/is-big-int-array.js");
var aTypedArrayConstructor = (__webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js").aTypedArrayConstructor);
var toBigInt = __webpack_require__(/*! ../internals/to-big-int */ "./node_modules/core-js/internals/to-big-int.js");

module.exports = function from(source /* , mapfn, thisArg */) {
  var C = aConstructor(this);
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, thisIsBigIntArray, value, step, iterator, next;
  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    O = [];
    while (!(step = call(next, iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2]);
  }
  length = lengthOfArrayLike(O);
  result = new (aTypedArrayConstructor(C))(length);
  thisIsBigIntArray = isBigIntArray(result);
  for (i = 0; length > i; i++) {
    value = mapping ? mapfn(O[i], i) : O[i];
    // FF30- typed arrays doesn't properly convert objects to typed array values
    result[i] = thisIsBigIntArray ? toBigInt(value) : +value;
  }
  return result;
};


/***/ },

/***/ "./node_modules/core-js/internals/uid.js"
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ },

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ },

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ },

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ },

/***/ "./node_modules/core-js/internals/well-known-symbol.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ },

/***/ "./node_modules/core-js/internals/wrap-error-constructor-with-cause.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/internals/wrap-error-constructor-with-cause.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var proxyAccessor = __webpack_require__(/*! ../internals/proxy-accessor */ "./node_modules/core-js/internals/proxy-accessor.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js/internals/normalize-string-argument.js");
var installErrorCause = __webpack_require__(/*! ../internals/install-error-cause */ "./node_modules/core-js/internals/install-error-cause.js");
var clearErrorStack = __webpack_require__(/*! ../internals/error-stack-clear */ "./node_modules/core-js/internals/error-stack-clear.js");
var ERROR_STACK_INSTALLABLE = __webpack_require__(/*! ../internals/error-stack-installable */ "./node_modules/core-js/internals/error-stack-installable.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    if (ERROR_STACK_INSTALLABLE) createNonEnumerableProperty(result, 'stack', clearErrorStack(result.stack, 2));
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


/***/ },

/***/ "./node_modules/core-js/modules/es.array-buffer.slice.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.array-buffer.slice.js ***!
  \***************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var ArrayBufferModule = __webpack_require__(/*! ../internals/array-buffer */ "./node_modules/core-js/internals/array-buffer.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");

var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var DataViewPrototype = DataView.prototype;
var nativeArrayBufferSlice = uncurryThis(ArrayBuffer.prototype.slice);
var getUint8 = uncurryThis(DataViewPrototype.getUint8);
var setUint8 = uncurryThis(DataViewPrototype.setUint8);

var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
$({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice && end === undefined) {
      return nativeArrayBufferSlice(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
    var viewSource = new DataView(this);
    var viewTarget = new DataView(result);
    var index = 0;
    while (first < fin) {
      setUint8(viewTarget, index++, getUint8(viewSource, first++));
    } return result;
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/es.array.iterator.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.iterator.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return createIterResultObject(undefined, true);
  }
  if (kind == 'keys') return createIterResultObject(index, false);
  if (kind == 'values') return createIterResultObject(target[index], false);
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ },

/***/ "./node_modules/core-js/modules/es.array.push.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.push.js ***!
  \*******************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var setArrayLength = __webpack_require__(/*! ../internals/array-set-length */ "./node_modules/core-js/internals/array-set-length.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js/internals/does-not-exceed-safe-integer.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
}();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_TO_LENGTH || SILENT_ON_NON_WRITABLE_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/es.error.cause.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.error.cause.js ***!
  \********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var wrapErrorConstructorWithCause = __webpack_require__(/*! ../internals/wrap-error-constructor-with-cause */ "./node_modules/core-js/internals/wrap-error-constructor-with-cause.js");

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = global[WEB_ASSEMBLY];

var FORCED = Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  }
};

// https://github.com/tc39/proposal-error-cause
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


/***/ },

/***/ "./node_modules/core-js/modules/es.json.stringify.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.json.stringify.js ***!
  \***********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = call($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ },

/***/ "./node_modules/core-js/modules/es.object.has-own.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.has-own.js ***!
  \***********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

// `Object.hasOwn` method
// https://github.com/tc39/proposal-accessible-object-hasownproperty
$({ target: 'Object', stat: true }, {
  hasOwn: hasOwn
});


/***/ },

/***/ "./node_modules/core-js/modules/es.regexp.exec.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.exec.js ***!
  \********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var exec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ },

/***/ "./node_modules/core-js/modules/es.string.replace.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.replace.js ***!
  \***********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var advanceStringIndex = __webpack_require__(/*! ../internals/advance-string-index */ "./node_modules/core-js/internals/advance-string-index.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var getSubstitution = __webpack_require__(/*! ../internals/get-substitution */ "./node_modules/core-js/internals/get-substitution.js");
var regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = isNullOrUndefined(searchValue) ? undefined : getMethod(searchValue, REPLACE);
      return replacer
        ? call(replacer, searchValue, O, replaceValue)
        : call(nativeReplace, toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          var replacement = toString(apply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);


/***/ },

/***/ "./node_modules/core-js/modules/es.symbol.description.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.description.js ***!
  \***************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
  var symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineProperty(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = thisSymbolValue(this);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var string = symbolDescriptiveString(symbol);
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.at.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.at.js ***!
  \***********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod('at', function at(index) {
  var O = aTypedArray(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.fill.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.fill.js ***!
  \*************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $fill = __webpack_require__(/*! ../internals/array-fill */ "./node_modules/core-js/internals/array-fill.js");
var toBigInt = __webpack_require__(/*! ../internals/to-big-int */ "./node_modules/core-js/internals/to-big-int.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var slice = uncurryThis(''.slice);

// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
var CONVERSION_BUG = fails(function () {
  var count = 0;
  // eslint-disable-next-line es/no-typed-arrays -- safe
  new Int8Array(2).fill({ valueOf: function () { return count++; } });
  return count !== 1;
});

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  var length = arguments.length;
  aTypedArray(this);
  var actualValue = slice(classof(this), 0, 3) === 'Big' ? toBigInt(value) : +value;
  return call($fill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
}, CONVERSION_BUG);


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.find-last-index.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.find-last-index.js ***!
  \************************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $findLastIndex = (__webpack_require__(/*! ../internals/array-iteration-from-last */ "./node_modules/core-js/internals/array-iteration-from-last.js").findLastIndex);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.find-last.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.find-last.js ***!
  \******************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $findLast = (__webpack_require__(/*! ../internals/array-iteration-from-last */ "./node_modules/core-js/internals/array-iteration-from-last.js").findLast);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.set.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.set.js ***!
  \************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var toOffset = __webpack_require__(/*! ../internals/to-offset */ "./node_modules/core-js/internals/to-offset.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.sort.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.sort.js ***!
  \*************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var internalSort = __webpack_require__(/*! ../internals/array-sort */ "./node_modules/core-js/internals/array-sort.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var FF = __webpack_require__(/*! ../internals/engine-ff-version */ "./node_modules/core-js/internals/engine-ff-version.js");
var IE_OR_EDGE = __webpack_require__(/*! ../internals/engine-is-ie-or-edge */ "./node_modules/core-js/internals/engine-is-ie-or-edge.js");
var V8 = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var WEBKIT = __webpack_require__(/*! ../internals/engine-webkit-version */ "./node_modules/core-js/internals/engine-webkit-version.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = global.Uint16Array;
var nativeSort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
  nativeSort(new Uint16Array(2), null);
}) && fails(function () {
  nativeSort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  nativeSort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return nativeSort(this, comparefn);

  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);


/***/ },

/***/ "./node_modules/core-js/modules/es.typed-array.uint8-array.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.uint8-array.js ***!
  \********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var createTypedArrayConstructor = __webpack_require__(/*! ../internals/typed-array-constructor */ "./node_modules/core-js/internals/typed-array-constructor.js");

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.iterator.constructor.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.constructor.js ***!
  \*********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-iterator-helpers
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var NativeIterator = global.Iterator;

// FF56- have non-standard global helper `Iterator`
var FORCED = IS_PURE
  || !isCallable(NativeIterator)
  || NativeIterator.prototype !== IteratorPrototype
  // FF44- non-standard `Iterator` passes previous tests
  || !fails(function () { NativeIterator({}); });

var IteratorConstructor = function Iterator() {
  anInstance(this, IteratorPrototype);
};

if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) {
  createNonEnumerableProperty(IteratorPrototype, TO_STRING_TAG, 'Iterator');
}

if (FORCED || !hasOwn(IteratorPrototype, 'constructor') || IteratorPrototype.constructor === Object) {
  createNonEnumerableProperty(IteratorPrototype, 'constructor', IteratorConstructor);
}

IteratorConstructor.prototype = IteratorPrototype;

$({ global: true, constructor: true, forced: FORCED }, {
  Iterator: IteratorConstructor
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.iterator.filter.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.filter.js ***!
  \****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-iterator-helpers
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var filterer = this.filterer;
  var next = this.next;
  var result, done, value;
  while (true) {
    result = anObject(call(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
    value = result.value;
    if (callWithSafeIterationClosing(iterator, filterer, [value, this.counter++], true)) return value;
  }
});

$({ target: 'Iterator', proto: true, real: true, forced: true }, {
  filter: function filter(filterer) {
    return new IteratorProxy(getIteratorDirect(this), {
      filterer: aCallable(filterer)
    });
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.iterator.find.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.find.js ***!
  \**************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-iterator-helpers
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

$({ target: 'Iterator', proto: true, real: true, forced: true }, {
  find: function find(fn) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(fn);
    return iterate(record, function (value, stop) {
      if (fn(value, counter++)) return stop(value);
    }, { IS_RECORD: true, INTERRUPTED: true }).result;
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.iterator.for-each.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.for-each.js ***!
  \******************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-iterator-helpers
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

$({ target: 'Iterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(fn);
    iterate(record, function (value) {
      fn(value, counter++);
    }, { IS_RECORD: true });
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.iterator.map.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.map.js ***!
  \*************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-iterator-helpers
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
});

$({ target: 'Iterator', proto: true, real: true, forced: true }, {
  map: function map(mapper) {
    return new IteratorProxy(getIteratorDirect(this), {
      mapper: aCallable(mapper)
    });
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.typed-array.to-reversed.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.typed-array.to-reversed.js ***!
  \************************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arrayToReversed = __webpack_require__(/*! ../internals/array-to-reversed */ "./node_modules/core-js/internals/array-to-reversed.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
exportTypedArrayMethod('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray(this), getTypedArrayConstructor(this));
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.typed-array.to-sorted.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.typed-array.to-sorted.js ***!
  \**********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var arrayFromConstructorAndList = __webpack_require__(/*! ../internals/array-from-constructor-and-list */ "./node_modules/core-js/internals/array-from-constructor-and-list.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var sort = uncurryThis(ArrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
exportTypedArrayMethod('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor(O), O);
  return sort(A, compareFn);
});


/***/ },

/***/ "./node_modules/core-js/modules/esnext.typed-array.with.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.typed-array.with.js ***!
  \*****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arrayWith = __webpack_require__(/*! ../internals/array-with */ "./node_modules/core-js/internals/array-with.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var isBigIntArray = __webpack_require__(/*! ../internals/is-big-int-array */ "./node_modules/core-js/internals/is-big-int-array.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toBigInt = __webpack_require__(/*! ../internals/to-big-int */ "./node_modules/core-js/internals/to-big-int.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays -- required for testing
    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', { 'with': function (index, value) {
  var O = aTypedArray(this);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
} }['with'], !PROPER_ORDER);


/***/ },

/***/ "./node_modules/core-js/modules/web.dom-collections.iterator.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.iterator.js ***!
  \**********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ "./node_modules/core-js/internals/dom-token-list-prototype.js");
var ArrayIteratorMethods = __webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');


/***/ },

/***/ "./node_modules/core-js/modules/web.dom-exception.stack.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-exception.stack.js ***!
  \*****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js/internals/normalize-string-argument.js");
var DOMExceptionConstants = __webpack_require__(/*! ../internals/dom-exception-constants */ "./node_modules/core-js/internals/dom-exception-constants.js");
var clearErrorStack = __webpack_require__(/*! ../internals/error-stack-clear */ "./node_modules/core-js/internals/error-stack-clear.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, constructor: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ },

/***/ "./node_modules/core-js/modules/web.self.js"
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/web.self.js ***!
  \**************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var INCORRECT_VALUE = global.self !== global;

// `self` getter
// https://html.spec.whatwg.org/multipage/window-object.html#dom-self
try {
  if (DESCRIPTORS) {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var descriptor = Object.getOwnPropertyDescriptor(global, 'self');
    // some engines have `self`, but with incorrect descriptor
    // https://github.com/denoland/deno/issues/15765
    if (INCORRECT_VALUE || !descriptor || !descriptor.get || !descriptor.enumerable) {
      defineBuiltInAccessor(global, 'self', {
        get: function self() {
          return global;
        },
        set: function self(value) {
          if (this !== global) throw $TypeError('Illegal invocation');
          defineProperty(global, 'self', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
          });
        },
        configurable: true,
        enumerable: true
      });
    }
  } else $({ global: true, simple: true, forced: INCORRECT_VALUE }, {
    self: global
  });
} catch (error) { /* empty */ }


/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js ***!
  \*********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/stable/instance/includes */ "./node_modules/core-js-pure/stable/instance/includes.js");

/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js"
/*!********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js ***!
  \********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/stable/instance/reverse */ "./node_modules/core-js-pure/stable/instance/reverse.js");

/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/trim.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/trim.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/stable/instance/trim */ "./node_modules/core-js-pure/stable/instance/trim.js");

/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/object/from-entries.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js-stable/object/from-entries.js ***!
  \***********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/stable/object/from-entries */ "./node_modules/core-js-pure/stable/object/from-entries.js");

/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/url-search-params.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js-stable/url-search-params.js ***!
  \*********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/stable/url-search-params */ "./node_modules/core-js-pure/stable/url-search-params/index.js");

/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/url.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js-stable/url.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/stable/url */ "./node_modules/core-js-pure/stable/url/index.js");

/***/ },

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/replace-all.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/replace-all.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/replace-all */ "./node_modules/core-js-pure/features/instance/replace-all.js");

/***/ },

/***/ "./node_modules/core-js-pure/actual/instance/replace-all.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/replace-all.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/replace-all */ "./node_modules/core-js-pure/stable/instance/replace-all.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/es/array/virtual/includes.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/includes.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.includes */ "./node_modules/core-js-pure/modules/es.array.includes.js");
var getBuiltInPrototypeMethod = __webpack_require__(/*! ../../../internals/get-built-in-prototype-method */ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'includes');


/***/ },

/***/ "./node_modules/core-js-pure/es/array/virtual/reverse.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/reverse.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.reverse */ "./node_modules/core-js-pure/modules/es.array.reverse.js");
var getBuiltInPrototypeMethod = __webpack_require__(/*! ../../../internals/get-built-in-prototype-method */ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'reverse');


/***/ },

/***/ "./node_modules/core-js-pure/es/instance/includes.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/includes.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var arrayMethod = __webpack_require__(/*! ../array/virtual/includes */ "./node_modules/core-js-pure/es/array/virtual/includes.js");
var stringMethod = __webpack_require__(/*! ../string/virtual/includes */ "./node_modules/core-js-pure/es/string/virtual/includes.js");

var ArrayPrototype = Array.prototype;
var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.includes;
  if (it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.includes)) return arrayMethod;
  if (typeof it == 'string' || it === StringPrototype || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.includes)) {
    return stringMethod;
  } return own;
};


/***/ },

/***/ "./node_modules/core-js-pure/es/instance/replace-all.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/replace-all.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../string/virtual/replace-all */ "./node_modules/core-js-pure/es/string/virtual/replace-all.js");

var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.replaceAll;
  return typeof it == 'string' || it === StringPrototype
    || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.replaceAll) ? method : own;
};


/***/ },

/***/ "./node_modules/core-js-pure/es/instance/reverse.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/reverse.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/reverse */ "./node_modules/core-js-pure/es/array/virtual/reverse.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reverse;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.reverse) ? method : own;
};


/***/ },

/***/ "./node_modules/core-js-pure/es/instance/trim.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/trim.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../string/virtual/trim */ "./node_modules/core-js-pure/es/string/virtual/trim.js");

var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.trim;
  return typeof it == 'string' || it === StringPrototype
    || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.trim) ? method : own;
};


/***/ },

/***/ "./node_modules/core-js-pure/es/object/from-entries.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/from-entries.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../modules/es.object.from-entries */ "./node_modules/core-js-pure/modules/es.object.from-entries.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.fromEntries;


/***/ },

/***/ "./node_modules/core-js-pure/es/string/virtual/includes.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/es/string/virtual/includes.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.string.includes */ "./node_modules/core-js-pure/modules/es.string.includes.js");
var getBuiltInPrototypeMethod = __webpack_require__(/*! ../../../internals/get-built-in-prototype-method */ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('String', 'includes');


/***/ },

/***/ "./node_modules/core-js-pure/es/string/virtual/replace-all.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/es/string/virtual/replace-all.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.regexp.exec */ "./node_modules/core-js-pure/modules/es.regexp.exec.js");
__webpack_require__(/*! ../../../modules/es.string.replace */ "./node_modules/core-js-pure/modules/es.string.replace.js");
__webpack_require__(/*! ../../../modules/es.string.replace-all */ "./node_modules/core-js-pure/modules/es.string.replace-all.js");
var getBuiltInPrototypeMethod = __webpack_require__(/*! ../../../internals/get-built-in-prototype-method */ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('String', 'replaceAll');


/***/ },

/***/ "./node_modules/core-js-pure/es/string/virtual/trim.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/es/string/virtual/trim.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.string.trim */ "./node_modules/core-js-pure/modules/es.string.trim.js");
var getBuiltInPrototypeMethod = __webpack_require__(/*! ../../../internals/get-built-in-prototype-method */ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('String', 'trim');


/***/ },

/***/ "./node_modules/core-js-pure/features/instance/replace-all.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/replace-all.js ***!
  \********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/replace-all */ "./node_modules/core-js-pure/full/instance/replace-all.js");


/***/ },

/***/ "./node_modules/core-js-pure/full/instance/replace-all.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/replace-all.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: remove from `core-js@4`
__webpack_require__(/*! ../../modules/esnext.string.replace-all */ "./node_modules/core-js-pure/modules/esnext.string.replace-all.js");

var parent = __webpack_require__(/*! ../../actual/instance/replace-all */ "./node_modules/core-js-pure/actual/instance/replace-all.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/internals/a-callable.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-callable.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/a-possible-prototype.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-possible-prototype.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPossiblePrototype = __webpack_require__(/*! ../internals/is-possible-prototype */ "./node_modules/core-js-pure/internals/is-possible-prototype.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/add-to-unscopables.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/add-to-unscopables.js ***!
  \*******************************************************************/
(module) {

"use strict";

module.exports = function () { /* empty */ };


/***/ },

/***/ "./node_modules/core-js-pure/internals/an-instance.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/an-instance.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/an-object.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/an-object.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/array-from.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-from.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");
var setArrayLength = __webpack_require__(/*! ../internals/array-set-length */ "./node_modules/core-js-pure/internals/array-set-length.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator-internal */ "./node_modules/core-js-pure/internals/get-iterator-internal.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method-internal */ "./node_modules/core-js-pure/internals/get-iterator-method-internal.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js-pure/internals/iterator-close.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js");

var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var O = toObject(arrayLike);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    result = IS_CONSTRUCTOR ? new this() : [];
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    for (;!(step = call(next, iterator)).done; index++) {
      try {
        doesNotExceedSafeInteger(index);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      try {
        createProperty(result, index, value);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  setArrayLength(result, index);
  return result;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/array-includes.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-includes.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/array-set-length.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-set-length.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/array-slice.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-slice.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ },

/***/ "./node_modules/core-js-pure/internals/array-sort.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-sort.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ },

/***/ "./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js ***!
  \*********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js-pure/internals/iterator-close.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/classof-raw.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/classof-raw.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/classof.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/classof.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/correct-is-regexp-logic.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/correct-is-regexp-logic.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/correct-prototype-getter.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/correct-prototype-getter.js ***!
  \*************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/create-iter-result-object.js"
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-iter-result-object.js ***!
  \**************************************************************************/
(module) {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-non-enumerable-property.js ***!
  \*******************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/create-property-descriptor.js"
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-property-descriptor.js ***!
  \***************************************************************************/
(module) {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/create-property.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-property.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/define-built-in-accessor.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-in-accessor.js ***!
  \*************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  return defineProperty.f(target, name, descriptor);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/define-built-in.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-in.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
  return target;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/define-built-ins.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-ins.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");

module.exports = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else defineBuiltIn(target, key, src[key], options);
  } return target;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/define-global-property.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-global-property.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/descriptors.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/descriptors.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/document-create-element.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/document-create-element.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js ***!
  \*****************************************************************************/
(module) {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw new $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/dom-iterables.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/dom-iterables.js ***!
  \**************************************************************/
(module) {

"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/enum-bug-keys.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/enum-bug-keys.js ***!
  \**************************************************************/
(module) {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ },

/***/ "./node_modules/core-js-pure/internals/environment-user-agent.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/environment-user-agent.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ },

/***/ "./node_modules/core-js-pure/internals/environment-v8-version.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/environment-v8-version.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var userAgent = __webpack_require__(/*! ../internals/environment-user-agent */ "./node_modules/core-js-pure/internals/environment-user-agent.js");

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ },

/***/ "./node_modules/core-js-pure/internals/export.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/export.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js-pure/internals/function-apply.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f);
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js-pure/internals/is-forced.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
// add debugging info
__webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return apply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? globalThis : STATIC ? globalThis[TARGET] : globalThis[TARGET] && globalThis[TARGET].prototype;

  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;

    // bind methods to global for calling from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis);
    // wrap global constructors for prevent changes in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    createNonEnumerableProperty(target, key, resultProperty);

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/fails.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/fails.js ***!
  \******************************************************/
(module) {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-apply.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-apply.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-bind-context.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind-context.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-bind-native.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind-native.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () { /* empty */ }.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-call.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-call.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-name.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-name.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && function something() { /* empty */ }.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js ***!
  \*******************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this-clause.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js"
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-built-in-prototype-method.js ***!
  \******************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = function (CONSTRUCTOR, METHOD) {
  var Namespace = path[CONSTRUCTOR + 'Prototype'];
  var pureMethod = Namespace && Namespace[METHOD];
  if (pureMethod) return pureMethod;
  var NativeConstructor = globalThis[CONSTRUCTOR];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  return NativePrototype && NativePrototype[METHOD];
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-built-in.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-built-in.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis[namespace])
    : path[namespace] && path[namespace][method] || globalThis[namespace] && globalThis[namespace][method];
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-internal-iterator.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-internal-iterator.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

module.exports = function (it) {
  var klass = classof(it);
  if (klass === 'Arguments') klass = 'Array';
  return hasOwn(Iterators, klass) ? Iterators[klass] : undefined;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-iterator-internal.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-iterator-internal.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method-internal */ "./node_modules/core-js-pure/internals/get-iterator-method-internal.js");

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (isCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-iterator-method-internal.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-iterator-method-internal.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var getInternalIterator = __webpack_require__(/*! ../internals/get-internal-iterator */ "./node_modules/core-js-pure/internals/get-internal-iterator.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || getInternalIterator(it);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-method.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-method.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/get-substitution.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-substitution.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
// eslint-disable-next-line redos/no-vulnerable -- safe
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/global-this.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/global-this.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ },

/***/ "./node_modules/core-js-pure/internals/has-own-property.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/has-own-property.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/hidden-keys.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/hidden-keys.js ***!
  \************************************************************/
(module) {

"use strict";

module.exports = {};


/***/ },

/***/ "./node_modules/core-js-pure/internals/html.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/html.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ },

/***/ "./node_modules/core-js-pure/internals/ie8-dom-define.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/ie8-dom-define.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/indexed-object.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/indexed-object.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ },

/***/ "./node_modules/core-js-pure/internals/inspect-source.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/inspect-source.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ },

/***/ "./node_modules/core-js-pure/internals/internal-state.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/internal-state.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-array-iterator-method.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-array-iterator-method.js ***!
  \*************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-array.js"
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-array.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-callable.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-callable.js ***!
  \************************************************************/
(module) {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-constructor.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-constructor.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js-pure/internals/inspect-source.js");

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-forced.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-forced.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-null-or-undefined.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-null-or-undefined.js ***!
  \*********************************************************************/
(module) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-object.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-object.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-possible-prototype.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-possible-prototype.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-pure.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-pure.js ***!
  \********************************************************/
(module) {

"use strict";

module.exports = true;


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-regexp.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-regexp.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/is-symbol.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-symbol.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/iterate.js"
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterate.js ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator-internal */ "./node_modules/core-js-pure/internals/get-iterator-internal.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method-internal */ "./node_modules/core-js-pure/internals/get-iterator-method-internal.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js-pure/internals/iterator-close.js");

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    var $iterator = iterator;
    iterator = undefined;
    if ($iterator) iteratorClose($iterator, 'normal');
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    // `IteratorValue` errors should propagate without closing the iterator
    var value = step.value;
    try {
      result = callFn(value);
    } catch (error) {
      if (iterator) iteratorClose(iterator, 'throw', error);
      else throw error;
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/iterator-close.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-close.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/iterator-create-constructor.js"
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-create-constructor.js ***!
  \****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js-pure/internals/iterators-core.js").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/iterator-define.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-define.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js-pure/internals/function-name.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js-pure/internals/iterator-create-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js-pure/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    }

    return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/iterators-core.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterators-core.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/iterators.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterators.js ***!
  \**********************************************************/
(module) {

"use strict";

module.exports = Object.create ? Object.create(null) : {};


/***/ },

/***/ "./node_modules/core-js-pure/internals/length-of-array-like.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/length-of-array-like.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js-pure/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/math-trunc.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/math-trunc.js ***!
  \***********************************************************/
(module) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/not-a-regexp.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/not-a-regexp.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isRegExp = __webpack_require__(/*! ../internals/is-regexp */ "./node_modules/core-js-pure/internals/is-regexp.js");

var $TypeError = TypeError;

module.exports = function (it) {
  if (isRegExp(it)) {
    throw new $TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-assign.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-assign.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol('assign detection');
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-create.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-create.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js-pure/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js-pure/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-define-properties.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-define-properties.js ***!
  \*************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-define-property.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-define-property.js ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js-pure/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js ***!
  \***********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js-pure/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js"
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-symbols.js ***!
  \********************************************************************************/
(__unused_webpack_module, exports) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-get-prototype-of.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-prototype-of.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js-pure/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-is-prototype-of.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-is-prototype-of.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-keys-internal.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-keys-internal.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js-pure/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-keys.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-keys.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js"
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-property-is-enumerable.js ***!
  \******************************************************************************/
(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-set-prototype-of.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-set-prototype-of.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(/*! ../internals/function-uncurry-this-accessor */ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js-pure/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ },

/***/ "./node_modules/core-js-pure/internals/object-to-string.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-to-string.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/ordinary-to-primitive.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/path.js"
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/path.js ***!
  \*****************************************************/
(module) {

"use strict";

module.exports = {};


/***/ },

/***/ "./node_modules/core-js-pure/internals/regexp-flags-detection.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/regexp-flags-detection.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
var RegExp = globalThis.RegExp;

var FLAGS_GETTER_IS_CORRECT = !fails(function () {
  var INDICES_SUPPORT = true;
  try {
    RegExp('.', 'd');
  } catch (error) {
    INDICES_SUPPORT = false;
  }

  var O = {};
  // modern V8 bug
  var calls = '';
  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

  var addGetter = function (key, chr) {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(O, key, { get: function () {
      calls += chr;
      return true;
    } });
  };

  var pairs = {
    dotAll: 's',
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y'
  };

  if (INDICES_SUPPORT) pairs.hasIndices = 'd';

  for (var key in pairs) addGetter(key, pairs[key]);

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var result = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call(O);

  return result !== expected || calls !== expected;
});

module.exports = { correct: FLAGS_GETTER_IS_CORRECT };


/***/ },

/***/ "./node_modules/core-js-pure/internals/regexp-flags.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/regexp-flags.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/regexp-get-flags.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/regexp-get-flags.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var regExpFlagsDetection = __webpack_require__(/*! ../internals/regexp-flags-detection */ "./node_modules/core-js-pure/internals/regexp-flags-detection.js");
var regExpFlagsGetterImplementation = __webpack_require__(/*! ../internals/regexp-flags */ "./node_modules/core-js-pure/internals/regexp-flags.js");

var RegExpPrototype = RegExp.prototype;

module.exports = regExpFlagsDetection.correct ? function (it) {
  return it.flags;
} : function (it) {
  return (!regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, 'flags'))
    ? call(regExpFlagsGetterImplementation, it)
    : it.flags;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/require-object-coercible.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/require-object-coercible.js ***!
  \*************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/safe-get-built-in.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/safe-get-built-in.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
module.exports = function (name) {
  if (!DESCRIPTORS) return globalThis[name];
  var descriptor = getOwnPropertyDescriptor(globalThis, name);
  return descriptor && descriptor.value;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/set-to-string-tag.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/set-to-string-tag.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js-pure/internals/object-to-string.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  var target = STATIC ? it : it && it.prototype;
  if (target) {
    if (!hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/shared-key.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared-key.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js-pure/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js-pure/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/shared-store.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared-store.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js-pure/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.50.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.',
  license: 'https://github.com/zloirock/core-js/blob/v3.50.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/shared.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");
// eslint-disable-next-line es/no-object-create -- safe
var create = Object.create || Object;

module.exports = function (key, value) {
  return store[key] || (store[key] = value || create(null));
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/string-multibyte.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-multibyte.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/string-punycode-to-ascii.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-punycode-to-ascii.js ***!
  \*************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;

var $RangeError = RangeError;
var exec = uncurryThis(regexSeparators.exec);
var floor = Math.floor;
var fromCharCode = String.fromCharCode;
var charCodeAt = uncurryThis(''.charCodeAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var split = uncurryThis(''.split);
var toLowerCase = uncurryThis(''.toLowerCase);

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = charCodeAt(string, counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = charCodeAt(string, counter++);
      if ((extra & 0xFC00) === 0xDC00) { // Low surrogate.
        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        push(output, value);
        counter--;
      }
    } else {
      push(output, value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  while (delta > baseMinusTMin * tMax >> 1) {
    delta = floor(delta / baseMinusTMin);
    k += base;
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      push(output, fromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    push(output, delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw new $RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw new $RangeError(OVERFLOW_ERROR);
      }
      if (currentValue === n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        var k = base;
        while (true) {
          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
          k += base;
        }

        push(output, fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        handledCPCount++;
      }
    }

    delta++;
    n++;
  }
  return join(output, '');
};

module.exports = function (input) {
  var encoded = [];
  var labels = split(replace(toLowerCase(input), regexSeparators, '\u002E'), '.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
  }
  return join(encoded, '.');
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/string-trim-forced.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-trim-forced.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var PROPER_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js-pure/internals/function-name.js").PROPER);
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var whitespaces = __webpack_require__(/*! ../internals/whitespaces */ "./node_modules/core-js-pure/internals/whitespaces.js");

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]()
      || non[METHOD_NAME]() !== non
      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
  });
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/string-trim.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-trim.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var whitespaces = __webpack_require__(/*! ../internals/whitespaces */ "./node_modules/core-js-pure/internals/whitespaces.js");

var replace = uncurryThis(''.replace);
var ltrim = RegExp('^[' + whitespaces + ']+');
var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '$1');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/symbol-constructor-detection.js ***!
  \*****************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/environment-v8-version */ "./node_modules/core-js-pure/internals/environment-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-absolute-index.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-absolute-index.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-indexed-object.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-indexed-object.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js"
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-integer-or-infinity.js ***!
  \***********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js-pure/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-length.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-length.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-object.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-object.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-primitive.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-primitive.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js-pure/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-property-key.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-property-key.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js-pure/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js-pure/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-string-tag-support.js"
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-string-tag-support.js ***!
  \**********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
// eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ },

/***/ "./node_modules/core-js-pure/internals/to-string.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-string.js ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/try-to-string.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/try-to-string.js ***!
  \**************************************************************/
(module) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/uid.js"
/*!****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/uid.js ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.1.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/url-constructor-detection.js"
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/url-constructor-detection.js ***!
  \**************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
  var url = new URL('b?a=1&b=2&c=3', 'https://a');
  var params = url.searchParams;
  var params2 = new URLSearchParams('a=1&a=2&b=3');
  var result = '';
  url.pathname = 'c%20d';
  params.forEach(function (value, key) {
    params['delete']('b');
    result += key + value;
  });
  params2['delete']('a', 2);
  // `undefined` case is a Chromium 117 bug
  // https://bugs.chromium.org/p/v8/issues/detail?id=14222
  params2['delete']('b', undefined);
  return (IS_PURE && (!url.toJSON || !params2.has('a', 1) || params2.has('a', 2) || !params2.has('a', undefined) || params2.has('b')))
    || (!params.size && (IS_PURE || !DESCRIPTORS))
    || !params.sort
    || url.href !== 'https://a/c%20d?a=1&c=3'
    || params.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !params[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('https://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('https://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('https://x', undefined).host !== 'x';
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/url-percent-coding.js"
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/url-percent-coding.js ***!
  \*******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.string.from-code-point */ "./node_modules/core-js-pure/modules/es.string.from-code-point.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var fromCharCode = String.fromCharCode;
var fromCodePoint = getBuiltIn('String', 'fromCodePoint');
var $encodeURIComponent = encodeURIComponent;
var $parseInt = parseInt;
var charAt = uncurryThis(''.charAt);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);

var FALLBACK_REPLACER = '\uFFFD';
var VALID_HEX = /^[0-9a-f]+$/i;
// a surrogate pair is matched first, so a one-unit match is always a lone surrogate
var SURROGATE = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g;

var parseHexOctet = function (string, start) {
  var substr = stringSlice(string, start, start + 2);
  if (!exec(VALID_HEX, substr)) return NaN;

  return $parseInt(substr, 16);
};

var getLeadingOnes = function (octet) {
  var count = 0;
  for (var mask = 0x80; mask > 0 && (octet & mask) !== 0; mask >>= 1) {
    count++;
  }
  return count;
};

var utf8Decode = function (octets) {
  var codePoint = null;
  var length = octets.length;

  switch (length) {
    case 1:
      codePoint = octets[0];
      break;
    case 2:
      codePoint = (octets[0] & 0x1F) << 6 | (octets[1] & 0x3F);
      break;
    case 3:
      codePoint = (octets[0] & 0x0F) << 12 | (octets[1] & 0x3F) << 6 | (octets[2] & 0x3F);
      break;
    case 4:
      codePoint = (octets[0] & 0x07) << 18 | (octets[1] & 0x3F) << 12 | (octets[2] & 0x3F) << 6 | (octets[3] & 0x3F);
      break;
  }

  // reject surrogates, overlong encodings, and out-of-range codepoints
  if (codePoint === null
    || codePoint > 0x10FFFF
    || (codePoint >= 0xD800 && codePoint <= 0xDFFF)
    || codePoint < (length > 3 ? 0x10000 : length > 2 ? 0x800 : length > 1 ? 0x80 : 0)
  ) return null;

  return codePoint;
};

var replaceLoneSurrogate = function (chunk) {
  return chunk.length === 2 ? chunk : FALLBACK_REPLACER;
};

// https://url.spec.whatwg.org/#percent-decode
/* eslint-disable max-depth -- ok */
var decode = function (input) {
  var length = input.length;
  var result = '';
  var i = 0;

  while (i < length) {
    var decodedChar = charAt(input, i);

    if (decodedChar === '%') {
      if (charAt(input, i + 1) === '%' || i + 3 > length) {
        result += '%';
        i++;
        continue;
      }

      var octet = parseHexOctet(input, i + 1);

      // eslint-disable-next-line no-self-compare -- NaN check
      if (octet !== octet) {
        result += decodedChar;
        i++;
        continue;
      }

      i += 2;
      var byteSequenceLength = getLeadingOnes(octet);

      if (byteSequenceLength === 0) {
        decodedChar = fromCharCode(octet);
      } else {
        if (byteSequenceLength === 1 || byteSequenceLength > 4) {
          result += FALLBACK_REPLACER;
          i++;
          continue;
        }

        var octets = [octet];
        var sequenceIndex = 1;

        while (sequenceIndex < byteSequenceLength) {
          i++;
          if (i + 3 > length || charAt(input, i) !== '%') break;

          var nextByte = parseHexOctet(input, i + 1);

          // eslint-disable-next-line no-self-compare -- NaN check
          if (nextByte !== nextByte || nextByte > 191 || nextByte < 128) break;

          // https://encoding.spec.whatwg.org/#utf-8-decoder - position-specific byte ranges
          if (sequenceIndex === 1) {
            if (octet === 0xE0 && nextByte < 0xA0) break;
            if (octet === 0xED && nextByte > 0x9F) break;
            if (octet === 0xF0 && nextByte < 0x90) break;
            if (octet === 0xF4 && nextByte > 0x8F) break;
          }

          push(octets, nextByte);
          i += 2;
          sequenceIndex++;
        }

        if (octets.length !== byteSequenceLength) {
          result += FALLBACK_REPLACER;
          continue;
        }

        var codePoint = utf8Decode(octets);
        if (codePoint === null) {
          for (var replacement = 0; replacement < byteSequenceLength; replacement++) result += FALLBACK_REPLACER;
          i++;
          continue;
        } else {
          decodedChar = fromCodePoint(codePoint);
        }
      }
    }

    result += decodedChar;
    i++;
  }

  return result;
};
/* eslint-enable max-depth -- ok */

// https://url.spec.whatwg.org/#string-percent-encode-after-encoding
// a lone surrogate is the only input `encodeURIComponent` throws on, and the UTF-8
// encoder replaces it - so the throw selects the slow path instead of a per-call scan
var encode = function (input) {
  try {
    return $encodeURIComponent(input);
  } catch (error) {
    return $encodeURIComponent(replace(input, SURROGATE, replaceLoneSurrogate));
  }
};

module.exports = {
  decode: decode,
  encode: encode
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/use-symbol-as-uid.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ },

/***/ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/v8-prototype-define-bug.js ***!
  \************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ },

/***/ "./node_modules/core-js-pure/internals/validate-arguments-length.js"
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/validate-arguments-length.js ***!
  \**************************************************************************/
(module) {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/weak-map-basic-detection.js ***!
  \*************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ },

/***/ "./node_modules/core-js-pure/internals/well-known-symbol.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/well-known-symbol.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js-pure/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js-pure/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ },

/***/ "./node_modules/core-js-pure/internals/whitespaces.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/whitespaces.js ***!
  \************************************************************/
(module) {

"use strict";

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.array.includes.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.includes.js ***!
  \****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $includes = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js-pure/internals/array-includes.js").includes);
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js-pure/internals/add-to-unscopables.js");

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// Safari 26.4- bug
var BROKEN_ON_SPARSE_WITH_FROM_INDEX = fails(function () {
  // eslint-disable-next-line no-sparse-arrays, es/no-array-prototype-includes -- detection
  return [, 1].includes(undefined, 1);
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE || BROKEN_ON_SPARSE_WITH_FROM_INDEX }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.array.iterator.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.iterator.js ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js-pure/internals/add-to-unscopables.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js").f);
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  switch (state.kind) {
    case 'keys': return createIterResultObject(index, false);
    case 'values': return createIterResultObject(target[index], false);
  } return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.array.reverse.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.reverse.js ***!
  \***************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");

var nativeReverse = uncurryThis([].reverse);
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign -- dirty hack
    if (isArray(this)) this.length = this.length;
    return nativeReverse(this);
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.object.from-entries.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.from-entries.js ***!
  \*********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");

// `Object.fromEntries` method
// https://tc39.es/ecma262/#sec-object.fromentries
$({ target: 'Object', stat: true }, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, { AS_ENTRIES: true });
    return obj;
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.regexp.exec.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.regexp.exec.js ***!
  \*************************************************************/
() {

// empty


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.string.from-code-point.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.from-code-point.js ***!
  \************************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");

var $RangeError = RangeError;
var fromCharCode = String.fromCharCode;
// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
var $fromCodePoint = String.fromCodePoint;
var join = uncurryThis([].join);

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length !== 1;

// `String.fromCodePoint` method
// https://tc39.es/ecma262/#sec-string.fromcodepoint
$({ target: 'String', stat: true, arity: 1, forced: INCORRECT_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  fromCodePoint: function fromCodePoint(x) {
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i];
      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw new $RangeError(code + ' is not a valid code point');
      elements[i++] = code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
    } return join(elements, '');
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.string.includes.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.includes.js ***!
  \*****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var notARegExp = __webpack_require__(/*! ../internals/not-a-regexp */ "./node_modules/core-js-pure/internals/not-a-regexp.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var correctIsRegExpLogic = __webpack_require__(/*! ../internals/correct-is-regexp-logic */ "./node_modules/core-js-pure/internals/correct-is-regexp-logic.js");

var stringIndexOf = uncurryThis(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(
      toString(requireObjectCoercible(this)),
      toString(notARegExp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.string.iterator.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.iterator.js ***!
  \*****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js-pure/internals/string-multibyte.js").charAt);
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.string.replace-all.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.replace-all.js ***!
  \********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var isRegExp = __webpack_require__(/*! ../internals/is-regexp */ "./node_modules/core-js-pure/internals/is-regexp.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var getRegExpFlags = __webpack_require__(/*! ../internals/regexp-get-flags */ "./node_modules/core-js-pure/internals/regexp-get-flags.js");
var getSubstitution = __webpack_require__(/*! ../internals/get-substitution */ "./node_modules/core-js-pure/internals/get-substitution.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");

var REPLACE = wellKnownSymbol('replace');
var $TypeError = TypeError;
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var max = Math.max;

// `String.prototype.replaceAll` method
// https://tc39.es/ecma262/#sec-string.prototype.replaceall
$({ target: 'String', proto: true }, {
  replaceAll: function replaceAll(searchValue, replaceValue) {
    var O = requireObjectCoercible(this);
    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, position, replacement;
    var endOfLastMatch = 0;
    var result = '';
    if (isObject(searchValue)) {
      IS_REG_EXP = isRegExp(searchValue);
      if (IS_REG_EXP) {
        flags = toString(requireObjectCoercible(getRegExpFlags(searchValue)));
        if (!~indexOf(flags, 'g')) throw new $TypeError('`.replaceAll` does not allow non-global regexes');
      }
      replacer = getMethod(searchValue, REPLACE);
      if (replacer) return call(replacer, searchValue, O, replaceValue);
      if (IS_PURE && IS_REG_EXP) return replace(toString(O), searchValue, replaceValue);
    }
    string = toString(O);
    searchString = toString(searchValue);
    functionalReplace = isCallable(replaceValue);
    if (!functionalReplace) replaceValue = toString(replaceValue);
    searchLength = searchString.length;
    advanceBy = max(1, searchLength);
    position = indexOf(string, searchString);
    while (position !== -1) {
      replacement = functionalReplace
        ? toString(replaceValue(searchString, position, string))
        : getSubstitution(searchString, string, position, [], undefined, replaceValue);
      result += stringSlice(string, endOfLastMatch, position) + replacement;
      endOfLastMatch = position + searchLength;
      position = position + advanceBy > string.length ? -1 : indexOf(string, searchString, position + advanceBy);
    }
    if (endOfLastMatch < string.length) {
      result += stringSlice(string, endOfLastMatch);
    }
    return result;
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.string.replace.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.replace.js ***!
  \****************************************************************/
() {

// empty


/***/ },

/***/ "./node_modules/core-js-pure/modules/es.string.trim.js"
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.trim.js ***!
  \*************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $trim = (__webpack_require__(/*! ../internals/string-trim */ "./node_modules/core-js-pure/internals/string-trim.js").trim);
var forcedStringTrimMethod = __webpack_require__(/*! ../internals/string-trim-forced */ "./node_modules/core-js-pure/internals/string-trim-forced.js");

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/esnext.string.replace-all.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.string.replace-all.js ***!
  \************************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.string.replace-all */ "./node_modules/core-js-pure/modules/es.string.replace-all.js");


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js"
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.dom-collections.iterator.js ***!
  \***************************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js-pure/internals/dom-iterables.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

for (var COLLECTION_NAME in DOMIterables) {
  setToStringTag(globalThis[COLLECTION_NAME], COLLECTION_NAME);
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.constructor.js"
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.constructor.js ***!
  \********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var safeGetBuiltIn = __webpack_require__(/*! ../internals/safe-get-built-in */ "./node_modules/core-js-pure/internals/safe-get-built-in.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");
var percentCoding = __webpack_require__(/*! ../internals/url-percent-coding */ "./node_modules/core-js-pure/internals/url-percent-coding.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js-pure/internals/define-built-ins.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js-pure/internals/iterator-create-constructor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js-pure/internals/an-instance.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator-internal */ "./node_modules/core-js-pure/internals/get-iterator-internal.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method-internal */ "./node_modules/core-js-pure/internals/get-iterator-method-internal.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var arraySort = __webpack_require__(/*! ../internals/array-sort */ "./node_modules/core-js-pure/internals/array-sort.js");

var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);
var percentDecode = percentCoding.decode;
var percentEncode = percentCoding.encode;

var nativeFetch = safeGetBuiltIn('fetch');
var NativeRequest = safeGetBuiltIn('Request');
var Headers = safeGetBuiltIn('Headers');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var HeadersPrototype = Headers && Headers.prototype;
var TypeError = globalThis.TypeError;
var charAt = uncurryThis(''.charAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var splice = uncurryThis([].splice);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);

var plus = /\+/g;

// https://url.spec.whatwg.org/#urlencoded-parsing - `+` decodes to a space
var decodeQueryComponent = function (input) {
  return percentDecode(replace(input, plus, ' '));
};

var find = /[!'()~]|%20/g;

var replacements = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replacements[match];
};

var serialize = function (it) {
  return replace(percentEncode(it), find, replacer);
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    target: getInternalParamsState(params).entries,
    index: 0,
    kind: kind
  });
}, URL_SEARCH_PARAMS, function next() {
  var state = getInternalIteratorState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  var entry = target[index];
  switch (state.kind) {
    case 'keys': return createIterResultObject(entry.key, false);
    case 'values': return createIterResultObject(entry.value, false);
  } return createIterResultObject([entry.key, entry.value], false);
}, true);

var URLSearchParamsState = function (init) {
  this.entries = [];
  this.url = null;

  if (init !== undefined) {
    if (isObject(init)) this.parseObject(init);
    else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init));
  }
};

URLSearchParamsState.prototype = {
  type: URL_SEARCH_PARAMS,
  bindURL: function (url) {
    this.url = url;
    this.update();
  },
  parseObject: function (object) {
    var entries = this.entries;
    var iteratorMethod = getIteratorMethod(object);
    var iterator, next, step, entryIterator, entryNext, first, second;

    if (iteratorMethod) {
      iterator = getIterator(object, iteratorMethod);
      next = iterator.next;
      while (!(step = call(next, iterator)).done) {
        entryIterator = getIterator(anObject(step.value));
        entryNext = entryIterator.next;
        if (
          (first = call(entryNext, entryIterator)).done ||
          (second = call(entryNext, entryIterator)).done ||
          !call(entryNext, entryIterator).done
        ) throw new TypeError('Expected sequence with length 2');
        push(entries, { key: $toString(first.value), value: $toString(second.value) });
      }
    } else for (var key in object) if (hasOwn(object, key)) {
      push(entries, { key: key, value: $toString(object[key]) });
    }
  },
  parseQuery: function (query) {
    if (query) {
      var entries = this.entries;
      var attributes = split(query, '&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = split(attribute, '=');
          push(entries, {
            key: decodeQueryComponent(shift(entry)),
            value: decodeQueryComponent(join(entry, '='))
          });
        }
      }
    }
  },
  serialize: function () {
    var entries = this.entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      push(result, serialize(entry.key) + '=' + serialize(entry.value));
    } return join(result, '&');
  },
  update: function () {
    this.entries.length = 0;
    this.parseQuery(this.url.query);
  },
  updateURL: function () {
    if (this.url) this.url.update();
  }
};

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsPrototype);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var state = setInternalState(this, new URLSearchParamsState(init));
  if (!DESCRIPTORS) this.size = state.entries.length;
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

defineBuiltIns(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    var state = getInternalParamsState(this);
    validateArgumentsLength(arguments.length, 2);
    push(state.entries, { key: $toString(name), value: $toString(value) });
    if (!DESCRIPTORS) this.size++;
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name /* , value */) {
    var state = getInternalParamsState(this);
    var length = validateArgumentsLength(arguments.length, 1);
    var entries = state.entries;
    var key = $toString(name);
    var $value = length < 2 ? undefined : arguments[1];
    var value = $value === undefined ? $value : $toString($value);
    var index = 0;
    while (index < entries.length) {
      var entry = entries[index];
      if (entry.key === key && (value === undefined || entry.value === value)) {
        splice(entries, index, 1);
      } else index++;
    }
    if (!DESCRIPTORS) this.size = entries.length;
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    var entries = getInternalParamsState(this).entries;
    validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    var entries = getInternalParamsState(this).entries;
    validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) push(result, entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name /* , value */) {
    var entries = getInternalParamsState(this).entries;
    var length = validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var $value = length < 2 ? undefined : arguments[1];
    var value = $value === undefined ? $value : $toString($value);
    var index = 0;
    while (index < entries.length) {
      var entry = entries[index++];
      if (entry.key === key && (value === undefined || entry.value === value)) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    var state = getInternalParamsState(this);
    validateArgumentsLength(arguments.length, 2);
    var entries = state.entries;
    var found = false;
    var key = $toString(name);
    var val = $toString(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) splice(entries, index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) push(entries, { key: key, value: val });
    if (!DESCRIPTORS) this.size = entries.length;
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    arraySort(state.entries, function (a, b) {
      return a.key > b.key ? 1 : -1;
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
  return getInternalParamsState(this).serialize();
}, { enumerable: true });

// `URLSearchParams.prototype.size` getter
// https://url.spec.whatwg.org/#dom-urlsearchparams-size
if (DESCRIPTORS) defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
  get: function size() {
    return getInternalParamsState(this).entries.length;
  },
  configurable: true,
  enumerable: true
});

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, constructor: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!USE_NATIVE_URL && isCallable(Headers)) {
  var headersHas = uncurryThis(HeadersPrototype.has);
  var headersSet = uncurryThis(HeadersPrototype.set);

  var wrapRequestOptions = function (init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headersHas(headers, 'content-type')) {
          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return create(init, {
          body: createPropertyDescriptor(0, $toString(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (isCallable(nativeFetch)) {
    $({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (isCallable(NativeRequest)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestPrototype);
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    $({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.delete.js"
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.delete.js ***!
  \***************************************************************************/
() {

// empty


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.has.js"
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.has.js ***!
  \************************************************************************/
() {

// empty


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.js"
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.js ***!
  \********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/web.url-search-params.constructor */ "./node_modules/core-js-pure/modules/web.url-search-params.constructor.js");


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.size.js"
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.size.js ***!
  \*************************************************************************/
() {

// empty


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url.can-parse.js"
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.can-parse.js ***!
  \****************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");

var URL = getBuiltIn('URL');

// https://github.com/nodejs/node/issues/47505
// https://github.com/denoland/deno/issues/18893
var THROWS_WITHOUT_ARGUMENTS = USE_NATIVE_URL && fails(function () {
  URL.canParse();
});

// Bun ~ 1.0.30 bug
// https://github.com/oven-sh/bun/issues/9250
var WRONG_ARITY = fails(function () {
  return URL.canParse.length !== 1;
});

// `URL.canParse` method
// https://url.spec.whatwg.org/#dom-url-canparse
$({ target: 'URL', stat: true, forced: !THROWS_WITHOUT_ARGUMENTS || WRONG_ARITY }, {
  canParse: function canParse(url) {
    var length = validateArgumentsLength(arguments.length, 1);
    var urlString = toString(url);
    var base = length < 2 || arguments[1] === undefined ? undefined : toString(arguments[1]);
    try {
      return !!new URL(urlString, base);
    } catch (error) {
      return false;
    }
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url.constructor.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.constructor.js ***!
  \******************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.string.iterator */ "./node_modules/core-js-pure/modules/es.string.iterator.js");
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js-pure/internals/global-this.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js-pure/internals/an-instance.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js-pure/internals/object-assign.js");
var arrayFrom = __webpack_require__(/*! ../internals/array-from */ "./node_modules/core-js-pure/internals/array-from.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");
var codeAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js-pure/internals/string-multibyte.js").codeAt);
var toASCII = __webpack_require__(/*! ../internals/string-punycode-to-ascii */ "./node_modules/core-js-pure/internals/string-punycode-to-ascii.js");
var percentCoding = __webpack_require__(/*! ../internals/url-percent-coding */ "./node_modules/core-js-pure/internals/url-percent-coding.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var URLSearchParamsModule = __webpack_require__(/*! ../modules/web.url-search-params.constructor */ "./node_modules/core-js-pure/modules/web.url-search-params.constructor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");

var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var percentDecode = percentCoding.decode;
var percentEncode = percentCoding.encode;

var NativeURL = globalThis.URL;
var TypeError = globalThis.TypeError;
var parseInt = globalThis.parseInt;
var floor = Math.floor;
var pow = Math.pow;
var fromCharCode = String.fromCharCode;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var join = uncurryThis([].join);
var numberToString = uncurryThis(1.1.toString);
var pop = uncurryThis([].pop);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var split = uncurryThis(''.split);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);
var toLowerCase = uncurryThis(''.toLowerCase);
var unshift = uncurryThis([].unshift);

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[a-z]/i;
var ALPHANUMERIC_PLUS_MINUS_DOT = /[\d+\-.a-z]/i;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\da-f]+$/i;
/* eslint-disable regexp/no-control-character -- safe */
// https://url.spec.whatwg.org/#forbidden-domain-code-point
var FORBIDDEN_DOMAIN_CODE_POINT = /[\u0000-\u0020#%/:<>?@[\\\]^|\u007F]/;
// https://url.spec.whatwg.org/#forbidden-host-code-point
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
var NON_ASCII = /[^\u0000-\u007F]/;
/* eslint-enable regexp/no-control-character -- safe */
// UTS#46 maps these onto a string containing a forbidden domain code point, so a domain
// holding one is rejected - listing them is far smaller than shipping the mapping table
var MAPPED_ONTO_FORBIDDEN = '\u00A8\u00AF\u00B4\u00B8\u02D8\u02D9\u02DA\u02DB\u02DC\u02DD\u037A\u0384\u0385\u1FBD\u1FBF\u1FC0'
  + '\u1FC1\u1FCD\u1FCE\u1FCF\u1FDD\u1FDE\u1FDF\u1FED\u1FEE\u1FFD\u1FFE\u2017\u203E\u2047\u2048\u2049'
  + '\u2100\u2101\u2105\u2106\u2A74\u309B\u309C\uFC5E\uFC5F\uFC60\uFC61\uFC62\uFC63\uFDFA\uFDFB\uFE13'
  + '\uFE16\uFE47\uFE48\uFE49\uFE4A\uFE4B\uFE4C\uFE55\uFE56\uFE5F\uFE64\uFE65\uFE68\uFE6A\uFE6B\uFE70'
  + '\uFE72\uFE74\uFE76\uFE78\uFE7A\uFE7C\uFE7E\uFFE3';
// eslint-disable-next-line no-unassigned-vars -- expected `undefined` value
var EOF;

// https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table
var isIgnoredCodePoint = function (code) {
  return code === 0xAD || code === 0x34F || code === 0x200B || code === 0x3164
    || code === 0xFEFF || code === 0xFFA0
    || (code >= 0x115F && code <= 0x1160)
    || (code >= 0x17B4 && code <= 0x17B5)
    || (code >= 0x180B && code <= 0x180F)
    || (code >= 0x2060 && code <= 0x2064) || (code >= 0x206A && code <= 0x206F)
    || (code >= 0xFE00 && code <= 0xFE0F)
    || (code >= 0xE0100 && code <= 0xE01EF);
};

var isDisallowedCodePoint = function (code) {
  return code === 0xFFFD
    // lone surrogate - a matched pair is a single code point and never lands here
    || (code >= 0xD800 && code <= 0xDFFF)
    // C1 controls
    || (code >= 0x80 && code <= 0x9F)
    // line and paragraph separators, bidirectional formatting characters
    || (code >= 0x200E && code <= 0x200F) || (code >= 0x2028 && code <= 0x2029)
    || (code >= 0x202A && code <= 0x202E) || (code >= 0x2065 && code <= 0x2069)
    // noncharacters
    || (code >= 0xFDD0 && code <= 0xFDEF) || (code & 0xFFFE) === 0xFFFE
    // private use
    || (code >= 0xE000 && code <= 0xF8FF) || (code >= 0xF0000 && code <= 0x10FFFD);
};

var mapCodePoint = function (code) {
  // full-width forms
  if (code >= 0xFF01 && code <= 0xFF5E) return code - 0xFEE0;
  // spaces and the listed code points collapse onto a forbidden domain code point; a space
  // stands in for the real mapping since either way the domain is rejected
  if (code === 0xA0 || code === 0x1680 || code === 0x202F || code === 0x205F || code === 0x3000) return 0x20;
  if (code >= 0x2000 && code <= 0x200A) return 0x20;
  // the list holds no supplementary code point, and `fromCharCode` would truncate one
  if (code <= 0xFFFF && stringIndexOf(MAPPED_ONTO_FORBIDDEN, fromCharCode(code)) > -1) return 0x20;
  return code;
};

// https://url.spec.whatwg.org/#concept-domain-to-ascii
// A subset of UTS#46 processing - the full mapping table is too large to ship. Covered are the
// entries cheap to express: the ignored and disallowed code points, full-width forms, and the
// code points mapping onto a forbidden domain code point. Not covered, so such domains are
// punycoded rather than mapped or rejected: unassigned code points, half-width forms,
// compatibility decompositions, NFC, CheckJoiners, CheckBidi, and labels that already arrive
// punycoded - those are not decoded back for validation.
var domainToASCII = function (domain) {
  // every mapped, ignored and disallowed code point is non-ASCII, so an ASCII domain
  // needs the punycode step only - this keeps the common case off the slow path
  if (!exec(NON_ASCII, domain)) return domain === '' ? null : toASCII(domain);
  var codePoints = arrayFrom(domain);
  var result = '';
  var index, code, mapped;
  for (index = 0; index < codePoints.length; index++) {
    code = codeAt(codePoints[index], 0);
    if (isDisallowedCodePoint(code)) return null;
    if (isIgnoredCodePoint(code)) continue;
    mapped = mapCodePoint(code);
    result += mapped === code ? codePoints[index] : fromCharCode(mapped);
  }
  return result === '' ? null : toASCII(result);
};

// https://url.spec.whatwg.org/#ends-in-a-number-checker
var endsInNumber = function (input) {
  var parts = split(input, '.');
  var last, hexPart;
  if (parts[parts.length - 1] === '') {
    if (parts.length === 1) return false;
    parts.length--;
  }
  last = parts[parts.length - 1];
  if (exec(DEC, last)) return true;
  if (exec(HEX_START, last)) {
    hexPart = stringSlice(last, 2);
    return hexPart === '' || !!exec(HEX, hexPart);
  }
  return false;
};

// https://url.spec.whatwg.org/#concept-ipv4-parser
var parseIPv4 = function (input) {
  var parts = split(input, '.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] === '') {
    parts.length--;
  }
  partsLength = parts.length;
  if (partsLength > 4) return null;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part === '') return null;
    radix = 10;
    if (part.length > 1 && charAt(part, 0) === '0') {
      radix = exec(HEX_START, part) ? 16 : 8;
      part = stringSlice(part, radix === 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!exec(radix === 10 ? DEC : radix === 8 ? OCT : HEX, part)) return null;
      number = parseInt(part, radix);
    }
    push(numbers, number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index === partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = pop(numbers);
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// https://url.spec.whatwg.org/#concept-ipv6-parser
// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var chr = function () {
    return charAt(input, pointer);
  };

  if (chr() === ':') {
    if (charAt(input, 1) !== ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex === 8) return;
    if (chr() === ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && exec(HEX, chr())) {
      value = value * 16 + parseInt(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() === '.') {
      if (length === 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() === '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!exec(DIGIT, chr())) return;
        while (exec(DIGIT, chr())) {
          number = parseInt(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece === 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen === 2 || numbersSeen === 4) pieceIndex++;
      }
      if (numbersSeen !== 4) return;
      break;
    } else if (chr() === ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex !== 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  return currLength > maxLength ? currStart : maxIndex;
};

// https://url.spec.whatwg.org/#host-serializing
var serializeHost = function (host) {
  var result, index, compress, ignore0;

  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      unshift(result, host % 256);
      host = floor(host / 256);
    }
    return join(result, '.');
  }

  // ipv6
  if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += numberToString(host[index], 16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  }

  return host;
};

// https://url.spec.whatwg.org/#c0-control-percent-encode-set
// empty because the set is the code points outside U+0020..U+007E, which the range
// check below already covers; the sets extending it only add code points inside it
var C0ControlPercentEncodeSet = {};
var queryPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '#': 1, '<': 1, '>': 1
});
var specialQueryPercentEncodeSet = assign({}, queryPercentEncodeSet, {
  "'": 1
});
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1, '^': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

// https://url.spec.whatwg.org/#string-utf-8-percent-encode
var utf8PercentEncode = function (chr, set) {
  var code = codeAt(chr, 0);
  // percent-encoding leaves ' alone, but it belongs to the special-query percent-encode set
  return code >= 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : chr === "'" && hasOwn(set, chr) ? '%27' : percentEncode(chr);
};

// https://url.spec.whatwg.org/#special-scheme
var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

// https://url.spec.whatwg.org/#windows-drive-letter
var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length === 2 && exec(ALPHA, charAt(string, 0))
    && ((second = charAt(string, 1)) === ':' || (!normalized && second === '|'));
};

// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
    string.length === 2 ||
    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

// https://url.spec.whatwg.org/#single-dot-path-segment
var isSingleDot = function (segment) {
  return segment === '.' || toLowerCase(segment) === '%2e';
};

// https://url.spec.whatwg.org/#double-dot-path-segment
var isDoubleDot = function (segment) {
  segment = toLowerCase(segment);
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

var URLState = function (url, isBase, base) {
  var urlString = $toString(url);
  var baseState, failure, searchParams;
  if (isBase) {
    failure = this.parse(urlString);
    if (failure) throw new TypeError(failure);
    this.searchParams = null;
  } else {
    if (base !== undefined) baseState = new URLState(base, true);
    failure = this.parse(urlString, null, baseState);
    if (failure) throw new TypeError(failure);
    searchParams = getInternalSearchParamsState(new URLSearchParams());
    searchParams.bindURL(this);
    this.searchParams = searchParams;
  }
};

URLState.prototype = {
  type: 'URL',
  // https://url.spec.whatwg.org/#url-parsing
  // eslint-disable-next-line max-statements -- TODO
  parse: function (input, stateOverride, base) {
    var url = this;
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, chr, bufferCodePoints, failure;

    input = $toString(input);

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = replace(input, LEADING_C0_CONTROL_OR_SPACE, '');
      input = replace(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
    }

    input = replace(input, TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      chr = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (chr && exec(ALPHA, chr)) {
            buffer += toLowerCase(chr);
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (chr && exec(ALPHANUMERIC_PLUS_MINUS_DOT, chr)) {
            buffer += toLowerCase(chr);
          } else if (chr === ':') {
            if (stateOverride && (
              (url.isSpecial() !== hasOwn(specialSchemes, buffer)) ||
              (buffer === 'file' && (url.includesCredentials() || url.port !== null)) ||
              (url.scheme === 'file' && url.host === '')
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (url.isSpecial() && specialSchemes[url.scheme] === url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme === 'file') {
              state = FILE;
            } else if (url.isSpecial() && base && base.scheme === url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (url.isSpecial()) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] === '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              push(url.path, '');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && chr !== '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && chr === '#') {
            url.scheme = base.scheme;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme === 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (chr === '/' && codePoints[pointer + 1] === '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (chr === '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (chr === EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
          } else if (chr === '/' || (chr === '\\' && url.isSpecial())) {
            state = RELATIVE_SLASH;
          } else if (chr === '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = '';
            state = QUERY;
          } else if (chr === '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            if (url.path.length) url.path.length--;
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (url.isSpecial() && (chr === '/' || chr === '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (chr === '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (chr !== '/' || codePoints[pointer + 1] !== '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (chr !== '/' && chr !== '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (chr === '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint === ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = utf8PercentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
            (chr === '\\' && url.isSpecial())
          ) {
            if (seenAt && buffer === '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += chr;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme === 'file') {
            state = FILE_HOST;
            continue;
          } else if (chr === ':' && !seenBracket) {
            if (buffer === '') return INVALID_HOST;
            if (stateOverride === HOSTNAME) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
          } else if (
            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
            (chr === '\\' && url.isSpecial())
          ) {
            if (url.isSpecial() && buffer === '') return INVALID_HOST;
            if (stateOverride && buffer === '' && (url.includesCredentials() || url.port !== null)) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (chr === '[') seenBracket = true;
            else if (chr === ']') seenBracket = false;
            buffer += chr;
          } break;

        case PORT:
          if (exec(DIGIT, chr)) {
            buffer += chr;
          } else if (
            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
            (chr === '\\' && url.isSpecial()) ||
            stateOverride
          ) {
            if (buffer !== '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          url.host = '';
          if (chr === '/' || chr === '\\') state = FILE_SLASH;
          else if (base && base.scheme === 'file') {
            switch (chr) {
              case EOF:
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.query = base.query;
                break;
              case '?':
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.query = '';
                state = QUERY;
                break;
              case '#':
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.query = base.query;
                url.fragment = '';
                state = FRAGMENT;
                break;
              default:
                url.host = base.host;
                if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
                  url.path = arraySlice(base.path);
                  url.shortenPath();
                }
                state = PATH;
                continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (chr === '/' || chr === '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme === 'file') {
            url.host = base.host;
            if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))
              && isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (chr === EOF || chr === '/' || chr === '\\' || chr === '?' || chr === '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer === '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = url.parseHost(buffer);
              if (failure) return failure;
              if (url.host === 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += chr;
          break;

        case PATH_START:
          if (url.isSpecial()) {
            state = PATH;
            if (chr !== '/' && chr !== '\\') continue;
          } else if (!stateOverride && chr === '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && chr === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr !== EOF) {
            state = PATH;
            if (chr !== '/') continue;
          } break;

        case PATH:
          if (
            chr === EOF || chr === '/' ||
            (chr === '\\' && url.isSpecial()) ||
            (!stateOverride && (chr === '?' || chr === '#'))
          ) {
            if (isDoubleDot(buffer)) {
              url.shortenPath();
              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else if (isSingleDot(buffer)) {
              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else {
              if (url.scheme === 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                // eslint-disable-next-line max-depth -- ok
                if (url.host !== null && url.host !== '') url.host = '';
                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
              }
              push(url.path, buffer);
            }
            buffer = '';
            if (url.scheme === 'file' && (chr === EOF || chr === '?' || chr === '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                shift(url.path);
              }
            }
            if (chr === '?') {
              url.query = '';
              state = QUERY;
            } else if (chr === '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += utf8PercentEncode(chr, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (chr === '?') {
            url.query = '';
            state = QUERY;
          } else if (chr === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr !== EOF) {
            if (chr === ' ') {
              url.path[0] += codePoints[pointer + 1] === '?' || codePoints[pointer + 1] === '#' ? '%20' : ' ';
            } else {
              url.path[0] += utf8PercentEncode(chr, C0ControlPercentEncodeSet);
            }
          } break;

        case QUERY:
          if (!stateOverride && chr === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr !== EOF) {
            url.query += utf8PercentEncode(chr, url.isSpecial() ? specialQueryPercentEncodeSet : queryPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (chr !== EOF) url.fragment += utf8PercentEncode(chr, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  },
  // https://url.spec.whatwg.org/#host-parsing
  parseHost: function (input) {
    var result, codePoints, index;
    if (charAt(input, 0) === '[') {
      if (charAt(input, input.length - 1) !== ']') return INVALID_HOST;
      result = parseIPv6(stringSlice(input, 1, -1));
      if (!result) return INVALID_HOST;
      this.host = result;
    // opaque host
    } else if (!this.isSpecial()) {
      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += utf8PercentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      this.host = result;
    } else {
      input = domainToASCII(percentDecode(input));
      if (input === null || exec(FORBIDDEN_DOMAIN_CODE_POINT, input)) return INVALID_HOST;
      if (endsInNumber(input)) {
        result = parseIPv4(input);
        if (result === null) return INVALID_HOST;
        this.host = result;
      } else {
        this.host = input;
      }
    }
  },
  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
  cannotHaveUsernamePasswordPort: function () {
    return this.host === null || this.host === '' || this.cannotBeABaseURL || this.scheme === 'file';
  },
  // https://url.spec.whatwg.org/#include-credentials
  includesCredentials: function () {
    return this.username !== '' || this.password !== '';
  },
  // https://url.spec.whatwg.org/#is-special
  isSpecial: function () {
    return hasOwn(specialSchemes, this.scheme);
  },
  // https://url.spec.whatwg.org/#shorten-a-urls-path
  shortenPath: function () {
    var path = this.path;
    var pathSize = path.length;
    if (pathSize && (this.scheme !== 'file' || pathSize !== 1 || !isWindowsDriveLetter(path[0], true))) {
      path.length--;
    }
  },
  // https://url.spec.whatwg.org/#concept-url-serializer
  serialize: function () {
    var url = this;
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (url.includesCredentials()) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme === 'file') output += '//';
    if (host === null && !url.cannotBeABaseURL && path.length > 1 && path[0] === '') output += '/.';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  },
  // https://url.spec.whatwg.org/#dom-url-href
  setHref: function (href) {
    var failure = this.parse(href);
    if (failure) throw new TypeError(failure);
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-origin
  getOrigin: function () {
    var scheme = this.scheme;
    var port = this.port;
    if (scheme === 'blob') try {
      return new URLConstructor(this.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme === 'file' || !this.isSpecial()) return 'null';
    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
  },
  // https://url.spec.whatwg.org/#dom-url-protocol
  getProtocol: function () {
    return this.scheme + ':';
  },
  setProtocol: function (protocol) {
    this.parse($toString(protocol) + ':', SCHEME_START);
  },
  // https://url.spec.whatwg.org/#dom-url-username
  getUsername: function () {
    return this.username;
  },
  setUsername: function (username) {
    var codePoints = arrayFrom($toString(username));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.username = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.username += utf8PercentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-password
  getPassword: function () {
    return this.password;
  },
  setPassword: function (password) {
    var codePoints = arrayFrom($toString(password));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.password = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.password += utf8PercentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-host
  getHost: function () {
    var host = this.host;
    var port = this.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  },
  setHost: function (host) {
    if (this.cannotBeABaseURL) return;
    this.parse(host, HOST);
  },
  // https://url.spec.whatwg.org/#dom-url-hostname
  getHostname: function () {
    var host = this.host;
    return host === null ? '' : serializeHost(host);
  },
  setHostname: function (hostname) {
    if (this.cannotBeABaseURL) return;
    this.parse(hostname, HOSTNAME);
  },
  // https://url.spec.whatwg.org/#dom-url-port
  getPort: function () {
    var port = this.port;
    return port === null ? '' : $toString(port);
  },
  setPort: function (port) {
    if (this.cannotHaveUsernamePasswordPort()) return;
    port = $toString(port);
    if (port === '') this.port = null;
    else this.parse(port, PORT);
  },
  // https://url.spec.whatwg.org/#dom-url-pathname
  getPathname: function () {
    var path = this.path;
    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
  },
  setPathname: function (pathname) {
    if (this.cannotBeABaseURL) return;
    this.path = [];
    this.parse(pathname, PATH_START);
  },
  // https://url.spec.whatwg.org/#dom-url-search
  getSearch: function () {
    var query = this.query;
    return query ? '?' + query : '';
  },
  setSearch: function (search) {
    search = $toString(search);
    if (search === '') {
      this.query = null;
    } else {
      if (charAt(search, 0) === '?') search = stringSlice(search, 1);
      this.query = '';
      this.parse(search, QUERY);
    }
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-searchparams
  getSearchParams: function () {
    return this.searchParams.facade;
  },
  // https://url.spec.whatwg.org/#dom-url-hash
  getHash: function () {
    var fragment = this.fragment;
    return fragment ? '#' + fragment : '';
  },
  setHash: function (hash) {
    hash = $toString(hash);
    if (hash === '') {
      this.fragment = null;
      return;
    }
    if (charAt(hash, 0) === '#') hash = stringSlice(hash, 1);
    this.fragment = '';
    this.parse(hash, FRAGMENT);
  },
  update: function () {
    this.query = this.searchParams.serialize() || null;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLPrototype);
  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
  var state = setInternalState(that, new URLState(url, false, base));
  if (!DESCRIPTORS) {
    that.href = state.serialize();
    that.origin = state.getOrigin();
    that.protocol = state.getProtocol();
    that.username = state.getUsername();
    that.password = state.getPassword();
    that.host = state.getHost();
    that.hostname = state.getHostname();
    that.port = state.getPort();
    that.pathname = state.getPathname();
    that.search = state.getSearch();
    that.searchParams = state.getSearchParams();
    that.hash = state.getHash();
  }
};

var URLPrototype = URLConstructor.prototype;

var accessorDescriptor = function (getter, setter) {
  return {
    get: function () {
      return getInternalURLState(this)[getter]();
    },
    set: setter && function (value) {
      return getInternalURLState(this)[setter](value);
    },
    configurable: true,
    enumerable: true
  };
};

if (DESCRIPTORS) {
  // `URL.prototype.href` accessors pair
  // https://url.spec.whatwg.org/#dom-url-href
  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
  // `URL.prototype.origin` getter
  // https://url.spec.whatwg.org/#dom-url-origin
  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
  // `URL.prototype.protocol` accessors pair
  // https://url.spec.whatwg.org/#dom-url-protocol
  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
  // `URL.prototype.username` accessors pair
  // https://url.spec.whatwg.org/#dom-url-username
  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
  // `URL.prototype.password` accessors pair
  // https://url.spec.whatwg.org/#dom-url-password
  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
  // `URL.prototype.host` accessors pair
  // https://url.spec.whatwg.org/#dom-url-host
  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
  // `URL.prototype.hostname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hostname
  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
  // `URL.prototype.port` accessors pair
  // https://url.spec.whatwg.org/#dom-url-port
  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
  // `URL.prototype.pathname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-pathname
  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
  // `URL.prototype.search` accessors pair
  // https://url.spec.whatwg.org/#dom-url-search
  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
  // `URL.prototype.searchParams` getter
  // https://url.spec.whatwg.org/#dom-url-searchparams
  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
  // `URL.prototype.hash` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hash
  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
defineBuiltIn(URLPrototype, 'toString', function toString() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, constructor: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.js ***!
  \******************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/web.url.constructor */ "./node_modules/core-js-pure/modules/web.url.constructor.js");


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url.parse.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.parse.js ***!
  \************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");

var URL = getBuiltIn('URL');

// `URL.parse` method
// https://url.spec.whatwg.org/#dom-url-parse
$({ target: 'URL', stat: true, forced: !USE_NATIVE_URL }, {
  parse: function parse(url) {
    var length = validateArgumentsLength(arguments.length, 1);
    var urlString = toString(url);
    var base = length < 2 || arguments[1] === undefined ? undefined : toString(arguments[1]);
    try {
      return new URL(urlString, base);
    } catch (error) {
      return null;
    }
  }
});


/***/ },

/***/ "./node_modules/core-js-pure/modules/web.url.to-json.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.to-json.js ***!
  \**************************************************************/
() {

// empty


/***/ },

/***/ "./node_modules/core-js-pure/stable/instance/includes.js"
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/includes.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/includes */ "./node_modules/core-js-pure/es/instance/includes.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/stable/instance/replace-all.js"
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/replace-all.js ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/replace-all */ "./node_modules/core-js-pure/es/instance/replace-all.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/stable/instance/reverse.js"
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/reverse.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/reverse */ "./node_modules/core-js-pure/es/instance/reverse.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/stable/instance/trim.js"
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/trim.js ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/trim */ "./node_modules/core-js-pure/es/instance/trim.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/stable/object/from-entries.js"
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/from-entries.js ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/from-entries */ "./node_modules/core-js-pure/es/object/from-entries.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/stable/url-search-params/index.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/url-search-params/index.js ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../web/url-search-params */ "./node_modules/core-js-pure/web/url-search-params.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/stable/url/index.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/stable/url/index.js ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../web/url */ "./node_modules/core-js-pure/web/url.js");

module.exports = parent;


/***/ },

/***/ "./node_modules/core-js-pure/web/url-search-params.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/web/url-search-params.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../modules/web.url-search-params */ "./node_modules/core-js-pure/modules/web.url-search-params.js");
__webpack_require__(/*! ../modules/web.url-search-params.delete */ "./node_modules/core-js-pure/modules/web.url-search-params.delete.js");
__webpack_require__(/*! ../modules/web.url-search-params.has */ "./node_modules/core-js-pure/modules/web.url-search-params.has.js");
__webpack_require__(/*! ../modules/web.url-search-params.size */ "./node_modules/core-js-pure/modules/web.url-search-params.size.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.URLSearchParams;


/***/ },

/***/ "./node_modules/core-js-pure/web/url.js"
/*!**********************************************!*\
  !*** ./node_modules/core-js-pure/web/url.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ./url-search-params */ "./node_modules/core-js-pure/web/url-search-params.js");
__webpack_require__(/*! ../modules/web.url */ "./node_modules/core-js-pure/modules/web.url.js");
__webpack_require__(/*! ../modules/web.url.can-parse */ "./node_modules/core-js-pure/modules/web.url.can-parse.js");
__webpack_require__(/*! ../modules/web.url.parse */ "./node_modules/core-js-pure/modules/web.url.parse.js");
__webpack_require__(/*! ../modules/web.url.to-json */ "./node_modules/core-js-pure/modules/web.url.to-json.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.URL;


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!***********************************************************************************!*\
  !*** ./dev/js/inte-modules/ibe-modules/independent/ibe_login_lim.js + 16 modules ***!
  \***********************************************************************************/

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js
var includes = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js");
var includes_default = /*#__PURE__*/__webpack_require__.n(includes);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/url.js
var core_js_stable_url = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/url.js");
var url_default = /*#__PURE__*/__webpack_require__.n(core_js_stable_url);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/object/from-entries.js
var from_entries = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/object/from-entries.js");
var from_entries_default = /*#__PURE__*/__webpack_require__.n(from_entries);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/url-search-params.js
var url_search_params = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/url-search-params.js");
var url_search_params_default = /*#__PURE__*/__webpack_require__.n(url_search_params);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__("./node_modules/core-js/modules/es.error.cause.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__("./node_modules/core-js/modules/es.array.push.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.slice.js
var es_array_buffer_slice = __webpack_require__("./node_modules/core-js/modules/es.array-buffer.slice.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.json.stringify.js
var es_json_stringify = __webpack_require__("./node_modules/core-js/modules/es.json.stringify.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.has-own.js
var es_object_has_own = __webpack_require__("./node_modules/core-js/modules/es.object.has-own.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__("./node_modules/core-js/modules/es.string.replace.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.uint8-array.js
var es_typed_array_uint8_array = __webpack_require__("./node_modules/core-js/modules/es.typed-array.uint8-array.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.at.js
var es_typed_array_at = __webpack_require__("./node_modules/core-js/modules/es.typed-array.at.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.fill.js
var es_typed_array_fill = __webpack_require__("./node_modules/core-js/modules/es.typed-array.fill.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-last.js
var es_typed_array_find_last = __webpack_require__("./node_modules/core-js/modules/es.typed-array.find-last.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-last-index.js
var es_typed_array_find_last_index = __webpack_require__("./node_modules/core-js/modules/es.typed-array.find-last-index.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__("./node_modules/core-js/modules/es.typed-array.set.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.sort.js
var es_typed_array_sort = __webpack_require__("./node_modules/core-js/modules/es.typed-array.sort.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-reversed.js
var esnext_typed_array_to_reversed = __webpack_require__("./node_modules/core-js/modules/esnext.typed-array.to-reversed.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-sorted.js
var esnext_typed_array_to_sorted = __webpack_require__("./node_modules/core-js/modules/esnext.typed-array.to-sorted.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.with.js
var esnext_typed_array_with = __webpack_require__("./node_modules/core-js/modules/esnext.typed-array.with.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__("./node_modules/core-js/modules/web.dom-exception.stack.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.self.js
var web_self = __webpack_require__("./node_modules/core-js/modules/web.self.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/trim.js
var trim = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/trim.js");
var trim_default = /*#__PURE__*/__webpack_require__.n(trim);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.constructor.js
var esnext_iterator_constructor = __webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.find.js
var esnext_iterator_find = __webpack_require__("./node_modules/core-js/modules/esnext.iterator.find.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.map.js
var esnext_iterator_map = __webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js/instance/replace-all.js
var replace_all = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js/instance/replace-all.js");
var replace_all_default = /*#__PURE__*/__webpack_require__.n(replace_all);
;// ./dev/js/inte-modules/ibe-modules/general/ibe_variables.js

const retrieveGlobalVariables = function retrieveGlobalVariables(mode) {
  let auxiliar;
  if (!retrieveGlobalVariables.vars || mode === 'reload') {
    auxiliar = $('#ibcomProperties').attr('data-general-properties');
    if (auxiliar) {
      if (window.location.host === 'pred.iberia.es') {
        auxiliar = replace_all_default()(auxiliar).call(auxiliar, 'uatd-ibisservices.iberia.com', 'pre-ibisservices.iberia.com');
        auxiliar = replace_all_default()(auxiliar).call(auxiliar, 'uata-ibisauth.iberia.com', 'pre-ibisauth.iberia.com');
      }
      retrieveGlobalVariables.vars = JSON.parse(auxiliar);
    }
    if (!retrieveGlobalVariables.vars) {
      retrieveGlobalVariables.vars = {};
    }
    return retrieveGlobalVariables.vars;
  }
  return retrieveGlobalVariables.vars;
};
/* harmony default export */ const ibe_variables = (retrieveGlobalVariables);
;// ./dev/js/inte-modules/ibe-modules/general/ibe_inte-util.js


















const _retrieveGlobalVariab = ibe_variables(),
  localeg = _retrieveGlobalVariab.localeg,
  marketg = _retrieveGlobalVariab.marketg;
/**
 * @description This function contains some other functions that can be reused along the JS code.
 * @returns void
 */
/** getQuerystrParams
   * Parse querystring of a given url or location url to a JS object
   */
const getQuerystrParams = url => {
  const urlAux = url || document.location.href;
  const params = {};
  let match = null;
  if (urlAux && typeof urlAux === 'string') {
    const regExp = /([^?=&]+)(=([^&#]*))/g;
    while (match = regExp.exec(urlAux)) {
      params[match[1]] = match[3];
    }
  }
  return params;
};
// Get params from the URL.
const getQueryParam = param => {
  const result = document.location.search.match(new RegExp("(\\?|&)".concat(param, "(\\[\\])?=([^&]*)")));
  return result ? result[3] : false;
};
const getDateByFormat = (datestr, format, asUTC) => {
  let result = {};
  let regExp = null;
  let regExp2 = null;
  let matchFormat = null;
  let matchValue = null;
  if (typeof datestr === 'string' && typeof format === 'string') {
    datestr = datestr.replace(/[a-z]/gi, '|');
    regExp = /[a-z]+|[0-9]+/gi;
    regExp2 = /[a-z]+|[0-9]+/gi;
    matchFormat = regExp.exec(format);
    matchValue = regExp2.exec(datestr);
    while (matchFormat && matchValue) {
      result[matchFormat[0]] = matchValue[0];
      matchFormat = regExp.exec(format);
      matchValue = regExp2.exec(datestr);
    }
    if (asUTC !== true) {
      return new Date(result.YYYY || 0, (result.MM || 1) - 1, result.DD || 0, result.hh || 0, result.mm || 0, result.ss || 0, result.lll || 0);
    }
    return new Date(Date.UTC(result.YYYY || 0, (result.MM || 1) - 1, result.DD || 0, result.hh || 0, result.mm || 0, result.ss || 0, result.lll || 0));
  }
  result = null;
  return result;
};
const replaceAll = function repl(str, mapObj) {
  const arr = Object.keys(mapObj);
  let re;
  let strAux = str;
  $.each(arr, (key, value) => {
    re = new RegExp(value, 'g');
    // eslint-disable-next-line no-unused-vars
    strAux = strAux.replace(re, mapObj[value]);
  });
  return strAux;
};
const redirectByQuadrigam = (market, locale, quadrigam, contentType, target) => {
  contentType = contentType || 'Page';
  const targetCode = target || '';
  if (locale && market) {
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/Logic/Navigation/GetURLJSON',
        c: contentType,
        quadrigam,
        market: market.toUpperCase(),
        locale: locale.toLowerCase(),
        d: ''
      },
      success(data) {
        let urlExp = data.url;
        if (quadrigam === 'IBLOIN') {
          urlExp += window.location.search;
        }
        if (urlExp.indexOf(' ') > -1) {
          urlExp = urlExp.replace(' ', '+');
        }
        window.top.location = urlExp + targetCode;
      }
    });
  }
};
const loadjsfile = (filename, onload) => {
  const fileref = document.createElement('script');
  const scrurl = "/wcs_statics/js/ibe-modules/".concat(filename);
  fileref.setAttribute('type', 'text/javascript');
  fileref.setAttribute('src', scrurl);
  fileref.onload = onload;
  fileref.setAttribute('async', 'async');
  if ($("script[src='".concat(scrurl, "']")).length === 0) {
    document.getElementsByTagName('head')[0].appendChild(fileref);
  }
};
const initDateFormated = () => {
  // Seeker Dates. Rewrite date with js. With nginx and Akamai it does not update
  const $calstart = $("[data-function='cal-start']");
  const $calform = $("[data-function='cal-form']");
  if ($calstart.length > 0 || $calform.length > 0) {
    $('footer').append('<div id="datePicker"></div>');
    const $datepck = $('#datePicker');
    $datepck.datepicker({
      dateFormat: $calstart ? $calstart.attr('data-format') : $calform.attr('data-format'),
      setDate: new Date()
    });
    $('.dateO, .dateD').html($datepck.val());
    $datepck.datepicker('destroy').remove();
    $datepck.remove();
  }
};
const responsive = () => {
  let resolucion;
  if (window.innerWidth < 768) {
    resolucion = 'mobile';
  } else if (window.innerWidth >= 1024) {
    resolucion = 'desktop';
  } else {
    resolucion = 'tablet';
  }
  return resolucion;
};
// Opens Modals
const callModalwcs = (locale, market, assettype, assetid, assetorigin, modalTitle, modalURL, modalFull) => {
  $.ajax({
    encoding: 'UTF-8',
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Page/ShowModal',
      locale,
      market,
      assettype,
      assetid,
      origin: assetorigin,
      modalTitle,
      url: modalURL,
      d: ''
    },
    success(data) {
      var _context;
      $('.defaultModal').html(data);
      if (trim_default()(_context = $('#modalTitle').html()).call(_context) == '') {
        $('#modalTitle').html(modalTitle);
      }
      if ($('.modal-dialog').find('.ibe-accordion')) {
        dFrontJs.ibe_bootstrap_collapse.modalAccordion($('.modal-dialog'));
      }
      if ($('img[data-src]', data).length > 0) {
        dFrontJs.app.renderAllImgModal('.defaultModal');
      }
      dFrontJs.ibe_modal.closeModal();
    }
  });
};

/*
 * Default modal behaviour to show content from links embedded in rich text
 */
dFrontJs.modalFunction = function () {
  const init = () => {
    // Inicializamos la modal pasandole la clase
    // params: (element, modalButton, modalFull, cssClass, appendTo);

    dFrontJs.ibe_modal.init('.defaultModal', '.modal-link');
    $('.modal-link:not(inte-modalInit)').each(function modalink() {
      $(this).click(e => {
        e.preventDefault();
        const $this = $(this);
        const modalFull = $this.data('full-width');
        // Recover asset to show
        const assetid = $this.attr('data-contentid');
        const assettype = $this.attr('data-contenttype');
        const assetorigin = $this.attr('data-contentorigin');
        const modalTitle = $this.attr('title');
        let modalURL;
        $this.addClass('inte-modalInit');
        if ($this.attr('href') !== '#') {
          modalURL = $this.attr('href');
        } else if ($this.attr('data-href')) {
          modalURL = $this.attr('data-href');
        } else {
          modalURL = '#';
        }
        callModalwcs(localeg, marketg, assettype, assetid, assetorigin, modalTitle, modalURL, modalFull);
      });
    });
  };
  return {
    init
  };
}(jQuery);
/**	showErrorModal:
 * This functions displays a generic modal with a red button.
 * HTML of this modal is on the CSElement (IB_CS/Presentation/Page/GenericErrorModal)
 * that must be called when the page is created to ensure that HTML code of modal is included
 *
 * Inputs:
 * 	-	text (optional): 	Text message on modal if it's not provided modal will show a default text
 *  -	flags (optional):	JavaScript object that contains boolean flags to custom if some components are shown
 * 	expected: {btnclose:[true/false], btnaccept:[true/false], btncancel[true/false], closereload[true/false], bodyNoClose[true/false]}
 * 	-	title (Optional): Title of modal
 *  -   textBold (Optional): Text message on modal with bold class
 */
const showErrorModal = (text, flags, title, textBold) => {
  // Intitialize with default flags
  /*
  closeReload: Page is reloaded on accept and close
  btnclose: Show/hide close button
  btnaccept: Show/hide accept button
  */
  const ops = flags || {
    btnclose: true,
    btnaccept: true,
    closereload: false
  };
  const modal = $('.inte-errormodal');
  function setUpModal() {
    const modal$ = modal.length > 0 ? modal : $('.inte-errormodal');
    const mtitle$ = modal$.find('.title');
    const mtext$ = modal$.find('.modal-body > p.paragraph__regular--modal-claim');
    const mtextBold$ = modal$.find('.modal-body > p.bold');
    const btnaccept$ = modal$.find('.inte-modal-acceptbtn');
    const btnclose$ = modal$.find('.inte-modal-closebtn');
    const btncancel$ = modal$.find('.inte-modal-cancelbtn');
    const mdialog$ = modal$.find('.modal-dialog');

    // Change title only if provided
    if (title !== undefined && typeof title === 'string') {
      mtitle$.html(title);
    } else {
      mtitle$.html(mtitle$.data('defaulttitle'));
    }
    if (text !== undefined && typeof text === 'string') {
      mtext$.html(text);
    } else {
      mtext$.html(mtext$.data('defaulttext'));
    }
    if (textBold !== undefined && typeof textBold === 'string') {
      mtextBold$.removeClass('hidden');
      mtextBold$.html(textBold);
    } else {
      mtextBold$.addClass('hidden');
    }
    // Setup visualization
    if (ops.btnaccept) {
      btnaccept$.prop('disabled', false).show();
    } else {
      btnaccept$.prop('disabled', true).hide();
    }
    if (ops.btnclose) {
      btnclose$.prop('disabled', false).show();
    } else {
      btnclose$.prop('disabled', true).hide();
    }
    if (ops.btncancel) {
      btncancel$.prop('disabled', false).show();
    } else {
      btncancel$.prop('disabled', true).hide();
    }
    if (ops.bodyNoClose) {
      mdialog$.addClass('ibe-noClose');
    } else {
      mdialog$.removeClass('ibe-noClose');
    }
    ops.closereload && modal$.data('reload', 'reload');
    // Open modal:
    dFrontJs.ibe_modal.createModal('.inte-errormodal');
    dFrontJs.ibe_modal.showModal('.inte-errormodal');
  }
  if (modal.length > 0) {
    setUpModal();
  } else {
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl6h/BrowserCache3600/GenericErrorModal',
        market: marketg,
        locale: localeg,
        d: 'Desktop'
      }
    }).done(data => {
      $('body').append(data);
      dFrontJs.ibe_modal.closeModal();
      setUpModal();
    }).fail(() => {
      console.error('Cannot retrieve generic error modal');
    });
  }
};
const getBase64 = (i, validatedFiles, callback) => {
  const f = validatedFiles[i];
  const reader = new FileReader();
  reader.readAsDataURL(f);
  reader.onload = e => {
    callback(e.target.result);
  };
  reader.onerror = error => {
    throw error;
  };
};
const setMaxAttachments = parentForm => {
  const $parentForm = $(parentForm);
  const parent = $parentForm.find('.ibe-upload');
  const $errorMax = parent.find('[data-alert=files] p');
  const $input = parent.find('input');
  const numfiles = $input.attr('data-numFiles');
  const maxAttachments = numfiles !== undefined && numfiles.length > 0 ? numfiles : '3';
  const valueError = $errorMax.text().replace('{numFiles}', maxAttachments);
  $errorMax.text(valueError);
};

/**
 * Difference beetwen dateFrom and dateTo in days, months or years
 * @param {*} dateFrom 
 * @param {*} dateTo  
 * @param {*} type months, years
 * @returns Default in days 
 */
const getDatesDifference = (dateFrom, dateTo, type) => {
  var result = 0;
  if (dateFrom && dateTo) {
    dateFrom = getDateByFormat(dateFrom, 'YYYY-MM-DD');
    dateTo = getDateByFormat(dateTo, 'YYYY-MM-DD');
    switch (type) {
      case "months":
        result = dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear());
        break;
      case "years":
        result = dateTo.getFullYear() - dateFrom.getFullYear();
        break;
      default:
        result = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    }
    return result;
  } else {
    return result;
  }
};
const updateMonetatePagetype = pgtype => {
  if (window.monetateQ && typeof pgtype === 'string') {
    setTimeout(() => {
      window.monetateQ.push(['setPageType', pgtype]);
      window.monetateQ.push(['trackData']);
    }, 250);
  }
};
const digestSHA256 = async message => {
  const encoder = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(message));
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
};

/**
 * Returns if the page loads the web-iberia-plus angular app.
 * @returns {boolean} True if the page is the private area angular app.
 */
function isPrivateAreaApp() {
  return Boolean(document.querySelector('meta[name="fAppD"][content="IB_PLUS"]'));
}

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.filter.js
var esnext_iterator_filter = __webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js
var reverse = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js");
var reverse_default = /*#__PURE__*/__webpack_require__.n(reverse);
;// ./dev/js/inte-modules/ibe-modules/manage/SessionStorage.js

const setSessionStorageValue = (id, data) => {
  if (data && id && typeof id === 'string') {
    if (typeof data === 'string') {
      sessionStorage.setItem(id, data);
    } else {
      sessionStorage.setItem(id, JSON.stringify(data));
    }
  }
};
const getSessionStorageValue = id => {
  let storageValue = null;
  if (id && typeof id === 'string') {
    storageValue = sessionStorage.getItem(id);
    if (storageValue) {
      try {
        storageValue = JSON.parse(storageValue);
      } catch (e) {}
    }
  }
  return storageValue;
};
const removeSessionStorageValue = id => {
  if (id && typeof id === 'string') {
    sessionStorage.removeItem(id);
  }
};
const isSessionStorageWritable = () => {
  let supported = true;
  try {
    sessionStorage.setItem('isWritable', 'true');
  } catch (error) {
    supported = false;
  }
  if (supported === true) {
    removeSessionStorageValue('isWritable');
  }
  return supported;
};

;// ./dev/js/inte-modules/ibe-modules/manage/ibe-local-storage.js

const setLocalStorageValue = (id, data) => {
  if (data && id && typeof id === 'string') {
    if (typeof data === 'string') {
      localStorage.setItem(id, data);
    } else {
      localStorage.setItem(id, JSON.stringify(data));
    }
  }
};
const getLocalStorageValue = id => {
  let storageValue = null;
  if (id && typeof id === 'string') {
    storageValue = localStorage.getItem(id);
    if (storageValue) {
      try {
        storageValue = JSON.parse(storageValue);
      } catch (e) {}
    }
  }
  return storageValue;
};
const removeLocalStorageValue = id => {
  if (id && typeof id === 'string') {
    localStorage.removeItem(id);
  }
};
const isLocalStorageWritable = () => {
  let supported = true;
  try {
    localStorage.setItem('isWritable', 'true');
  } catch (error) {
    supported = false;
  }
  if (supported === true) {
    removeLocalStorageValue('isWritable');
  }
  return supported;
};

;// ./dev/js/inte-modules/ibe-modules/manage/ibe_common.js





const common = {
  MAX_ATTEMPS: 2,
  MAX_ATTEMPSCLAIMS: 2
};
function changeformatdate(date, formatIn, formatOut) {
  const formatInUp = formatIn.toUpperCase();
  const formatOutUp = formatOut.toUpperCase();
  const currDate = date.substring(formatInUp.indexOf('D'), formatInUp.indexOf('D') + 2);
  const currMonth = date.substring(formatInUp.indexOf('M'), formatInUp.indexOf('M') + 2);
  const currYear = date.substring(formatInUp.indexOf('Y'), formatInUp.indexOf('Y') + 4);
  const dateOut = formatOutUp.replace('DD', currDate).replace('MM', currMonth).replace('YYYY', currYear);
  return dateOut;
}
function getDateFormat(date, inUTC) {
  const dateOut = new Date(date);
  let day = !inUTC ? dateOut.getDate() : dateOut.getUTCDate();
  let month = !inUTC ? dateOut.getMonth() + 1 : dateOut.getUTCMonth() + 1;
  let hour = !inUTC ? dateOut.getHours() : dateOut.getUTCHours();
  const year = !inUTC ? dateOut.getFullYear() : dateOut.getUTCFullYear();
  let minutes = !inUTC ? dateOut.getMinutes() : dateOut.getUTCMinutes();
  let seconds = !inUTC ? dateOut.getSeconds() : dateOut.getUTCSeconds();
  day = day <= 9 ? "0".concat(day) : "".concat(day);
  month = month <= 9 ? "0".concat(month) : "".concat(month);
  hour = hour <= 9 ? "0".concat(hour) : "".concat(hour);
  minutes = minutes <= 9 ? "0".concat(minutes) : "".concat(minutes);
  seconds = seconds <= 9 ? "0".concat(seconds) : "".concat(seconds);
  return "".concat(day, "/").concat(month, "/").concat(year, " ").concat(hour, ":").concat(minutes, ":").concat(seconds);
}
function calculateDelimiterMiles(locale, market) {
  let delimiter = '';
  if (locale === 'en' || locale === 'ja' || locale === 'zh') {
    delimiter = ',';
  } else if (locale === 'fr') {
    delimiter = ' ';
    if (market === 'CH') {
      delimiter = "'";
    } else if (market === 'BE') {
      delimiter = '.';
    }
  } else if (locale === 'ru') {
    delimiter = ' ';
  } else {
    delimiter = '.';
    if (locale === 'es') {
      delimiter = '.';
      if (market === 'MX' || market === 'PA' || market === 'PR' || market === 'DO' || market === 'GT' || market === 'US') {
        delimiter = ',';
      }
    } else if (locale === 'de') {
      if (market === 'CH') {
        delimiter = "'";
      }
    }
  }
  return delimiter;
}
function setNumberFormat(input, locale, market) {
  var _context;
  const delim = calculateDelimiterMiles(locale, market);
  const num = reverse_default()(_context = input.toString().split('')).call(_context);
  let numFormat = '';
  let i = 0;
  for (i = num.length; i > 0; i--) {
    if (i % 3 === 0 && i !== num.length) {
      numFormat = numFormat + delim + num[i - 1];
    } else {
      numFormat += num[i - 1];
    }
  }
  return numFormat;
}
function toTitleCase(str) {
  return str.replace(/[A-zÀ-ú]\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
function setRolCIP(rolCIP) {
  let rol = rolCIP;
  if (rol.length > 20) {
    rol = "".concat(rol.substring(0, 16), "...");
  }
  return rol;
}
function setNameIBPlus(name, surname) {
  let nameFormat = "".concat(name, " ").concat(surname);
  if (nameFormat.length > 20) {
    nameFormat = "".concat(nameFormat.substring(0, 16), "...");
  }
  return nameFormat;
}
function deleteloggedcookies() {
  const expires = new Date('01 Jan 1970 00:00:00 UTC');
  const splitted = window.location.hostname.split('.');
  Cookies.set('IBERIACOM_SSO_ACCESS_SALESFORCE', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_REFRESH_SALESFORCE', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ACCESS', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ACCESS_TO', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_REFRESH', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_REFRESH_TO', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ONB_ACCESS', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ONB_ACCESS_TO', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ONB_REFRESH', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_ONB_REFRESH_TO', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_INFO', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  Cookies.set('IBERIACOM_SSO_TYPE', '', {
    path: '/',
    expires,
    sameSite: 'strict'
  });
  // Cookie Session IBPLUS
  Cookies.remove('IBERIACOM_SSO_SESION', {
    path: '/',
    domain: ".".concat(splitted.slice(splitted.length - 2).join('.'))
  });

  //Delete cookie contenidos
  removeLocalStorageValue('reloaded');
  removeLocalStorageValue('lastCookieValue');
  // Delete also Session storage info
  removeLocalStorageValue('IB_PERMANENT_LOGIN');
  removeLocalStorageValue('ib-avatar-cache');
  removeSessionStorageValue('customerData');
  removeSessionStorageValue('customerDataOB');
  removeSessionStorageValue('accessTokenOB');
  removeSessionStorageValue('customerDataZero');
  removeSessionStorageValue('ib-booking-partnerPreferences');
  // SessionStorage.remove('ib-identity-stateReferral');

  /* OB-Compatibility IBPLUS */
  if ($('#loggedUserDefaults').attr('data-inte-integrationHost') !== 'null' && $('#loggedUserDefaults').attr('data-inte-ibplusLogoutURL') !== 'null') {
    // OB Compatibility IBPLUS
    Cookies.set('IBERIACOM_IDENTIFICATION', '', {
      path: '/',
      expires,
      sameSite: 'strict'
    });
  }
  if (window.obLogoutXML !== 'null') {
    // OB Compatibility
    Cookies.set('IBERIACOM_SSO_CIP', '', {
      path: '/',
      expires,
      sameSite: 'strict'
    });
  }
}
function pushToMonetate() {
  const variables = [];
  if (window.monetateQ) {
    setTimeout(() => {
      $.each(datalayer_general, (key, value) => {
        variables.push({
          name: "dt_g_".concat(key),
          value
        });
      });
      $.each(digital_data, (key, value) => {
        variables.push({
          name: "dd_".concat(key),
          value
        });
      });
      window.monetateQ.push(['setPageType', datalayer_general.quadrigam]);
      window.monetateQ.push(['setCustomVariables', variables]);
      window.monetateQ.push(['trackData']);
    }, 250);
  }
}
function updateDatalayer(type) {
  if (typeof window.DigitalChange === 'function') {
    window.DigitalChange(type, datalayer_general, datalayer_ecommerce);
  }
  pushToMonetate();
}
function updateDigitalData(type) {
  if (window.dataLayer && typeof window.dataLayer.push === 'function') {
    window.dataLayer.push(digital_data, {
      'event': type
    });
  }
}

;// ./dev/js/inte-modules/ibe-modules/manage/ibe_anonymous-services.js

function callService(serviceUrl, headers, params, method) {
  let mthd = method;
  if (!mthd) {
    mthd = 'GET';
  }
  return $.ajax({
    url: serviceUrl,
    xhrFields: {
      withCredentials: true
    },
    type: mthd,
    headers,
    data: params
  });
}
function callTokenService(serviceUrl, authorizationToken, params) {
  // Default headers
  const headers = {
    Authorization: "Basic ".concat(authorizationToken),
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return callService(serviceUrl, headers, params, 'POST');
}
function generateAnonymousToken(serviceUrl, authorizationToken) {
  return callTokenService(serviceUrl, authorizationToken, $.param({
    grant_type: 'client_credentials'
  }));
}
function getAppTokenForServices(globalAppToken, tokenURL) {
  const deferred = $.Deferred();
  const anonymousToken = getSessionStorageValue('anonymousTokenForService');
  if (!anonymousToken) {
    generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
      setSessionStorageValue('anonymousTokenForService', tokenResponse.access_token);
      setSessionStorageValue('anonymousToken', tokenResponse.access_token);
      //SessionStorage.remove('accessToken');
      //deleteloggedcookies();
      deferred.resolve(tokenResponse.access_token);
    }).fail(() => {
      removeSessionStorageValue('anonymousToken');
      deferred.reject();
    });
  } else deferred.resolve(anonymousToken);
  return deferred.promise();
}

;// ./dev/js/inte-modules/ibe-modules/general/ibe_logavatar.js



const ibe_logavatar_retrieveGlobalVariab = ibe_variables(),
  avatarIBPLUSService = ibe_logavatar_retrieveGlobalVariab.avatarIBPLUSService;
const defaultAvatar = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCADIAMgBAREA/8QAHQABAAEFAQEBAAAAAAAAAAAAAAcBBQYICQQDAv/EADwQAAEDAwIDBAcGAwkAAAAAAAABAgMEBREGBxIhMQgTUWEXIkFWgZTRFBUyQpGhcXLBGCMkU2JnpNLi/9oACAEBAAA/AOlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGW5/aD0DtgslFcq5aq5Iio2kp041R3g9U/B8SFv7eX+3f/P/APBJe1fao0LuLW01jrGvtF3qVdwQyrmJVToiSLhFcvsT2k1gAAAAAAAAAGObjapTROhr1qpYe++7aV03BnGeaJ/U5h3y8V9/u1VeLlUPmqKqRZHveuVXJ4T9RzTU8jJ6eV8Usao5j2OVrmqnRUVOinRHsx7h1+4W19HV3qpZLdKFzqao4VyqNaqpGq+ataiqS0AAAAAAAAACGu1hcpqDaK4wxuwlYvcv80xn+hz3K4wUNx+whK9dP6qhc7LW1lOqeXqPNpgAAAAAAAAARH2pbO+6bPXmdqp/gI/tC58E5f1NBtLaUv8ArO7RWPTdAtZXTZ7uFHtarvb+ZU8FM6Xsy73oqMXQtTlen99F/wBjFtbbZ6327dSt1lY325aziWFHyMcruHGfwquOqdTaXsK0U8Gl9S1ckapHUVkHduVOTkRj0XBs+AAAAAAAAAC0at03Qav01cdNXNjnUtwgdDIjVwqp1Tn/ABRDnDqLT+tNltdK5iVNBW22oVaarYita7+V3RUVFVFwviSVF21d120zmSU1mdN+V6Uq4+KcRGmodV7g726qpoq581yuFVIkVPTxNXgjVyonJOfC3plV5Ib+bLbeu2z2/t+mZ3sfUxoss7mp+d68St88Kqpky+63W22O3z3a710FHR0zFfNPNIjGMb4qq8kIF1d20tu7DUtp7Dbau/J0e+J/ctavlxN5/A8umu27oG6132e/WGussGFXv3Sd+mfDhY3JPendTWLVdsgu9guUNZTTxtka6N6KqIqZRHJ1avkpdAAAAAAAACx6q0RpbWlGtFqSzU1azGGukjRXs/lVU5EYTdkDZWaoWoW13FqquVa2tcjf0wZ3oraXQW36tk01YYIZ2orUqHtR0yIvVOPGcKZc97ImLJI9GtamVVVwiIc+e0xvJcdyNY1dkt9bPHpygRaT7M2Ve6rueVdKzoqI7KYXPRFIZajWIjGIiNTkiInQqvXOSSdlN37xtTqmlqXVU33RM9rayDm5vdqvNyN9qomVQ6OW6vp7pb6W50iuWCrhZPErkwqse1HJlPZyU9AAAAAABg26G8OkdpaOmqtUSVHFWcSQRwRo9zlbjPJVTlzQ1fvvbq1/LqWpo7FoSzRaeY3ip699e9auR2PwuhVnC1M558S9DEqjtdb2VEr3R3+mhjcq4YlHEvCnhnGTFbnvlufdpXT1eqqpHO6907gT9ELNJuPruSTvXatu2U8KyRE/TJcLfvFuRbpElp9V16ub07yVz0/dTYfajdXXer9lNxr1qG9faZ7NS4peGJrFbmNyquU680NX9L0Np1BquiodRXR9voa2o4amqYxHOiR2fWRFVEXn5+0lrcrsm670rVQ1Gj6SfUVtqXYidBHmZqYzl7E5NTzyZpt12btN6G0ku5m9c/cOpsVEdukXgbHjCxteuUXjV3JWKmP1IA3N1nFrzWFZqGmtlNQU8mIoIaeJsbWxtyjfVaiJnHU3o7LFzrrtstZqu4VL55UfPEj3rleFsio1PgiIhLYAAAAABoh2zNUz3bc9tiZUMko7ZSxrGjV/C96eun6ohABUr5KUVMLgrjBsN2T71Q3Nupdp7gjY4tT0qv71V9rU4UanmvH+xCWr9O3LSWpbhYbnSyU09JO5vA9MKiZy1f0VFNouzR2kdO2rSz9J7iX9aSS3JmkqalcsdFywzPVXZyvP2EWdpHe+XdDUX3XZauT7gt7lSBqLhsz/AGv80VETGfAh+3W6tu1fBbLbSvqKqqkbFDExMue9VwiJ8TpntFoqLb/b60aajSRHRQpLK2THEyV/rPauPByqhmIAAAAAPjWVUVDST1s7uGKnjdK9fBrUyv7Icutxruy/68v13iqFmiqLhO+Jyrn1FevD+xjqcvaOhXzKA99jvVz05dqW+WeqfTVtFI2WGVi4Vrk6KbNVVt0T2prLDX0l0p7NrWjp+GaOZcNqcfmXxVeXtIM1Xs3uPo6o+z3nTFY1FzwPjakiOTx9XJ5dPbXa+1PVMpLPpiulkf04o+BE+LsG3OwvZcpdB1FPqvV8sdXdmtR0UDU9SBV8f9SeS45GxAAAAAABhW82qLdpHbS/XW6cXcyUklJ6qZXilarG/u5DmHDC2GNIm9EPqnIoMlU6FcJkKnsPvQV9Za62K4W6qkpqmndxxyxrhzHeKKS5prtY7x6do/sbbvTXJP8AMuETpnp8eJDbPs6bpXfdXREl61C6lS5RVckL2U7OBqMRG8K4yvipKoAAAAAAPDebJatQ0D7XeqCGspJHNc6GZiPY5UXKZReXUsnor219w7D8hH9B6LNtfcOw/IR/QeizbX3DsPyEf0Hor219w7D8hH9B6LNtfcOw/IR/Qeizbb3EsXyEf0Hos229xLF8hH9B6LNtfcOw/IR/Qeizbb3DsXyEf0LrZNL6e00ySOwWajt7JVy9tPC2NFX+CIXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=';

/**
 * @description Get avatar function with error handling and img in base64
 * @returns {Promise<string>} encode image base64
 * @see https://transform.atlassian.net/browse/CPA-185
 */

async function getAvatar() {
  const ibisTK = Cookies.get("IBERIACOM_SSO_ACCESS");
  const salesForceTK = Cookies.get("IBERIACOM_SSO_ACCESS_SALESFORCE");
  return fetch(avatarIBPLUSService, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: "Bearer ".concat(ibisTK),
      "X-Salesforce-Token": salesForceTK
    }
  }).then(response => {
    if (response.status === 204) {
      localStorage.setItem("ib-avatar-cache", "EMPTY");
      throw new Error("Empty image");
    } else {
      return response.blob();
    }
  }).then(data => {
    return blobToBase64(data);
  }).then(data => {
    if (data === defaultAvatar) {
      localStorage.setItem("ib-avatar-cache", "EMPTY");
      throw new Error("Empty image");
    }
    localStorage.setItem("ib-avatar-cache", data);
    return data;
  }).catch(error => {
    throw new Error("Server error");
  });
}

/**
 * @description Get avatar function with error handling and img in base64
 * @returns {Promise<string>} encode image base64
 */
async function getLoginAvatar() {
  return serviceCallWithRefresh(getAvatar).catch(error => {
    return Promise.reject(error);
  });
}

/**
 * @description [CPA-188] Transform image - Transform blob to encode base64 
 * @param {Blob} blob The blob to transform in string
 * @returns {Promise<string>} the base64 encode
 * @see https://transform.atlassian.net/browse/CPA-188
 */
async function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * @description Function that calls the event to load the avatar
 */
function listenerAvatarEvent() {
  document.addEventListener("ibAvatarUpdate", onIbAvatarUpdateEvent);
  window.addEventListener("storage", onAvatarStorageChangeEvent);
}

/**
 * @description Function that removes the call to the event
 */
function removeAvatarEvent() {
  document.removeEventListener("ibAvatarUpdate", onIbAvatarUpdateEvent);
  window.removeEventListener("storage", onAvatarStorageChangeEvent);
}
function onIbAvatarUpdateEvent() {
  updateLoginAvatar();
}

/**
 * @description Check the cache to avoid having to call the service and thus have it on all open screens
 * @param {String} event event interface parameter
 */
function onAvatarStorageChangeEvent(event) {
  if (event.storageArea === localStorage && event.key === "ib-avatar-cache" && event.newValue) {
    updateLoginAvatar();
  }
}

/**
 * @description Function get avatar cache where if it is null or undefined it puts empty
 * @returns {Promise<string>} If it is nothing it returns the localstorage of the image
 */
async function getCacheAvatar() {
  const avatarCache = localStorage.getItem("ib-avatar-cache");
  return avatarCache !== "EMPTY" ? Promise.resolve(avatarCache) : Promise.reject("Empty cache avatar");
}

/**
 * @description Change avatar where img avatar is if it is null or undefined it puts for default
 * @param {String} imgData Image base64 decode
 */
function changeAvatarImg(imgData) {
  imgData !== null && imgData !== void 0 ? imgData : imgData = "/wcs_statics/images/modules/icons/svgs/editar_perfil_red.svg";
  $(".ibe-header-new__logged-link>img, .ibe-login__logged-figure>img").each(function inside() {
    $(this).attr("src", imgData);
  });
}

/**
 * @description Update Avatar with error handling change with img or not. 
 */
function updateLoginAvatar() {
  getCacheAvatar().then(imgData => {
    if (imgData) {
      return imgData;
    }
    return getLoginAvatar();
  }).then(imgData => {
    changeAvatarImg(imgData);
  }).catch(error => {
    changeAvatarImg();
  });
}

;// ./dev/js/inte-modules/ibe-modules/manage/ibe_logged-service.js











function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }







const ibe_logged_service_retrieveGlobalVariab = ibe_variables(),
  ibe_logged_service_localeg = ibe_logged_service_retrieveGlobalVariab.localeg,
  ibe_logged_service_marketg = ibe_logged_service_retrieveGlobalVariab.marketg,
  tokenURL = ibe_logged_service_retrieveGlobalVariab.tokenURL,
  tokenUrlOB = ibe_logged_service_retrieveGlobalVariab.tokenUrlOB,
  customerDataServiceOB = ibe_logged_service_retrieveGlobalVariab.customerDataServiceOB,
  globalAppToken = ibe_logged_service_retrieveGlobalVariab.globalAppToken,
  salesforceURL = ibe_logged_service_retrieveGlobalVariab.salesforceURL,
  loginMicroserviceUrl = ibe_logged_service_retrieveGlobalVariab.loginMicroserviceUrl,
  retrieveMemberDetailV2 = ibe_logged_service_retrieveGlobalVariab.retrieveMemberDetailV2,
  customerZeroPersonal = ibe_logged_service_retrieveGlobalVariab.customerZeroPersonal,
  customerZeroContact = ibe_logged_service_retrieveGlobalVariab.customerZeroContact;
const SSO_COOKIE_DEFAULT_EXP = 315569520000 + new Date().getTime();
const isTokenExpired = expiration => {
  // Expiration format from cookie is: dd/MM/yyyy HH:mm
  let ok = true;
  let tokenDate;
  if (expiration) {
    tokenDate = getDateByFormat(expiration, 'DD/MM/YYYY hh:mm:ss', true);
    ok = tokenDate.getTime() <= new Date().getTime();
  }
  return ok;
};
const sendLoginInfo = () => {
  const loggedInfo = isLogado();
  try {
    if (window.BroadcastChannel) {
      const broadcastChannel = new window.BroadcastChannel('ib-idt-channel');
      if (loggedInfo.userType === 'IBPLUS') {
        broadcastChannel.postMessage({
          type: 'IBPLUS_LOGIN',
          payload: {
            members: getSessionStorageValue('retrieveMemberDetailV2')
          }
        });
      } else if (loggedInfo.userType === 'IBZERO') {
        const _SessionStorage$get = getSessionStorageValue('retrieveMemberDetailZero'),
          _SessionStorage$get2 = _slicedToArray(_SessionStorage$get, 2),
          personalData = _SessionStorage$get2[0],
          contactDetails = _SessionStorage$get2[1];
        broadcastChannel.postMessage({
          type: 'IBZERO_LOGIN',
          payload: {
            personalData: personalData,
            contactDetails: contactDetails
          }
        });
      }
      broadcastChannel.close();
    }
  } catch (e) {}
};
const generateLoginEvent = function () {
  let isSuccess = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  let data = arguments.length > 1 ? arguments[1] : undefined;
  if (isSuccess) {
    sendLoginInfo();
  }
  const event = new CustomEvent(isSuccess ? 'IDENTITY_LOGIN_SUCCESS' : 'IDENTITY_LOGIN_FAILURE', {
    detail: data
  });
  window.parent.dispatchEvent(event);
};
const isLogado = () => {
  let accessToken;
  let accessTokenExpire;
  let refreshTokenTxt;
  let refreshTokenExpire;
  let accessTokenSalesforce;
  let accessTokenExpireSalesforce;
  let refreshTokenSalesforce;
  let userLogged = false;
  let userType = null;
  let accesTokenSF;
  let accessTokenSFExpire;
  let refreshTokenSF;
  let refreshTokenSFExpire,
    isSoftUser = false;
  const permanentStorage = getLocalStorageValue('IB_PERMANENT_LOGIN');
  if (Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE')) {
    accesTokenSF = Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
    accessToken = Cookies.get('IBERIACOM_SSO_ACCESS');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_ACCESS')) {
    accessToken = Cookies.get('IBERIACOM_SSO_ONB_ACCESS');
  } else {
    accesTokenSF = null;
    accessToken = null;
  }
  if (Cookies.get('IBERIACOM_SSO_ACCESS_TO_SALESFORCE')) {
    accessTokenExpire = Cookies.get('IBERIACOM_SSO_ACCESS_TO');
    accessTokenSFExpire = Cookies.get('IBERIACOM_SSO_ACCESS_TO_SALESFORCE');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_ACCESS_TO')) {
    accessTokenExpire = Cookies.get('IBERIACOM_SSO_ONB_ACCESS_TO');
  } else {
    accessTokenExpire = null;
    accessTokenSFExpire = null;
  }
  if (Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE')) {
    refreshTokenTxt = Cookies.get('IBERIACOM_SSO_REFRESH');
    refreshTokenSF = Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_REFRESH')) {
    refreshTokenTxt = Cookies.get('IBERIACOM_SSO_ONB_REFRESH');
  } else {
    refreshTokenTxt = null;
  }
  if (Cookies.get('IBERIACOM_SSO_REFRESH_TO_SALESFORCE')) {
    refreshTokenSFExpire = Cookies.get('IBERIACOM_SSO_REFRESH_TO_SALESFORCE');
  } else {
    refreshTokenSFExpire = null;
  }
  if (Cookies.get('IBERIACOM_SSO_REFRESH_TO')) {
    refreshTokenExpire = Cookies.get('IBERIACOM_SSO_REFRESH_TO');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_REFRESH_TO')) {
    refreshTokenExpire = Cookies.get('IBERIACOM_SSO_ONB_REFRESH_TO');
  } else {
    refreshTokenExpire = null;
  }
  if (Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE')) {
    userType = 'IBPLUS';
  } else if (Cookies.get('IBERIACOM_SSO_ONB_REFRESH_TO')) {
    userType = 'OB';
  } else {
    userType = null;
  }
  if (Cookies.get('IBERIACOM_SSO_TYPE') === 'IBZERO') {
    userType = 'IBZERO';
  }
  if (userType === 'IBPLUS' || userType === 'IBZERO') {
    isSoftUser = permanentStorage || refreshTokenSF !== null && refreshTokenSF !== undefined && (accesTokenSF === null || accessTokenSFExpire === null || accessTokenSFExpire !== null && isTokenExpired(accessTokenSFExpire));
    if (isSoftUser) {
      const splitted = window.location.hostname.split('.');
      Cookies.remove('IBERIACOM_SSO_SESION', {
        path: '/',
        domain: ".".concat(splitted.slice(splitted.length - 2).join('.'))
      });
      setLocalStorageValue('IB_PERMANENT_LOGIN', 'true');
      removeSessionStorageValue('retrieveMemberDetailV2');
    }
  }
  userLogged = userType === 'OB' && refreshTokenTxt && refreshTokenExpire && !isTokenExpired(refreshTokenExpire) || (userType === 'IBPLUS' || userType === 'IBZERO') && refreshTokenSF !== null && refreshTokenSF !== undefined;
  return {
    userLogged,
    userType,
    accessToken,
    accesTokenSF,
    accessTokenExpire,
    accessTokenSFExpire,
    refreshTokenSF,
    refreshTokenSFExpire,
    refreshTokenTxt,
    refreshTokenExpire,
    accessTokenSalesforce,
    accessTokenExpireSalesforce,
    refreshTokenSalesforce,
    isSoftUser
  };
};
const getAppToken = (globalAppToken, tokenURL) => {
  // [JLR] I´m not sure if this functions is really needed and could be absorbed for other.
  // It is like redundant.
  const deferred = $.Deferred();
  const isLogged = isLogado();
  const cookieAccessToken = isLogged.userLogged ? isLogged.accessToken : null;
  const cookieRefreshToken = isLogged.userLogged ? isLogged.refreshTokenTxt : null;
  const cookieRefreshTokenExpire = isLogged.userLogged ? isLogged.refreshTokenExpire : null;
  let anonymousToken;
  if (!cookieRefreshToken || isTokenExpired(cookieRefreshTokenExpire)) {
    anonymousToken = getSessionStorageValue('anonymousToken');
    if (!anonymousToken) {
      generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
        setSessionStorageValue('anonymousToken', tokenResponse.access_token);

        /**/
        removeSessionStorageValue('accessToken');
        removeSessionStorageValue('accessTokenOB');
        deleteloggedcookies();
        /**/

        deferred.resolve(tokenResponse.access_token);
      }).fail(() => {
        deferred.reject();
      });
    } else {
      deferred.resolve(anonymousToken);
    }
  } else {
    deferred.resolve(cookieAccessToken);
  }
  return deferred.promise();
};
const refreshLoggedToken = (serviceUrl, authorizationToken, refreshTokn) => {
  const params = $.param({
    grant_type: 'refresh_token',
    refresh_token: refreshTokn
  });
  return callTokenService(serviceUrl, authorizationToken, params);
};

/**
 * Calls introspect service after getting the access token of salesforce to know the validation time if it is still active
 * @param data Access token service response
 * @return {*}
 */
const setCookiesSalesforce = data => {
  return new Promise((resolve, reject) => {
    if (data.access_token && data.access_token.length > 0 && data.refresh_token && data.refresh_token.length > 0) {
      const introspectEndpoint = "".concat(loginMicroserviceUrl, "rs/v1/token/salesforce-introspect");
      const paramsAccess = {
        token: data.access_token && data.access_token.length > 0 ? data.access_token : '',
        token_type_hint: 'access_token'
      };
      const paramsRefresh = {
        token: data.refresh_token && data.refresh_token.length > 0 ? data.refresh_token : '',
        token_type_hint: 'refresh_token'
      };
      const headers = {
        Authorization: "Bearer ".concat(getSessionStorageValue('anonymousToken'))
      };
      const serviceSuccess = resp => {
        const dataAccess = resp[1];
        const dataRefresh = resp[0];
        const expirationAccess = new Date(dataAccess.exp * 1000);
        const expirationRefresh = dataRefresh.exp ? new Date(dataRefresh.exp * 1000) : new Date(SSO_COOKIE_DEFAULT_EXP);
        const scheme = window.location.protocol === 'https:';
        document.cookie = "IBERIACOM_SSO_ACCESS_SALESFORCE=".concat(data.access_token, ";path=/;expires=").concat(expirationAccess.toGMTString(), ";secure=").concat(scheme, ";");
        document.cookie = "IBERIACOM_SSO_ACCESS_TO_SALESFORCE=".concat(getDateFormat(expirationAccess, true), ";path=/;expires=").concat(expirationAccess.toGMTString(), ";secure=").concat(scheme, ";");
        document.cookie = "IBERIACOM_SSO_REFRESH_SALESFORCE=".concat(data.refresh_token, ";path=/;expires=").concat(expirationRefresh.toGMTString(), ";secure=").concat(scheme, ";");
        document.cookie = "IBERIACOM_SSO_REFRESH_TO_SALESFORCE=".concat(getDateFormat(expirationRefresh, true), ";path=/;expires=").concat(expirationRefresh.toGMTString(), ";secure=").concat(scheme, ";");
        setSessionStorageValue('accessTokenSalesforce', data.access_token);
        resolve();
      };
      const serviceFailure = () => {
        //generateLoginEvent(false)
        reject();
      };
      Promise.all([fetch(introspectEndpoint, {
        body: new (url_search_params_default())(paramsRefresh),
        method: 'POST',
        headers
      }).then(res => res.json()), fetch(introspectEndpoint, {
        body: new (url_search_params_default())(paramsAccess),
        method: 'POST',
        headers
      }).then(res => res.json())]).then(serviceSuccess).catch(serviceFailure);
    } else {
      reject();
    }
  });
};
const setTokenKeycloack = (scope, salesforceAccessToken) => {
  const isLogged = isLogado();
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl0s/Integration/logOut'
      }
    });
    const headers = {
      Authorization: "Basic ".concat(globalAppToken),
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const tokSF = salesforceAccessToken !== null && salesforceAccessToken !== void 0 ? salesforceAccessToken : Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
    const params = {
      'code': tokSF,
      'grant_type': 'password',
      'login_type': 'authorization_code'
    };
    if (typeof scope === 'string' && scope.length > 0) {
      params.scope = scope;
    }
    const serviceSuccess = resp => {
      const scheme = window.location.protocol === 'https:';
      const date = new Date();
      const exAcc = date.getTime() + (resp.expires_in > 0 ? resp.expires_in * 1000 : 3600 * 1000);
      const exRefsh = date.getTime() + (resp.refresh_expires_in > 0 ? resp.refresh_expires_in * 1000 : 86400000);
      document.cookie = "IBERIACOM_SSO_ACCESS=".concat(resp.access_token, ";path=/;expires=").concat(new Date(exAcc).toGMTString(), ";secure=").concat(scheme, ";");
      document.cookie = "IBERIACOM_SSO_ACCESS_TO=".concat(getDateFormat(exAcc, true), ";path=/;expires=").concat(new Date(exAcc).toGMTString(), ";secure=").concat(scheme, ";");
      document.cookie = "IBERIACOM_SSO_REFRESH=".concat(resp.refresh_token, ";path=/;expires=").concat(new Date(exRefsh).toGMTString(), ";secure=").concat(scheme, ";");
      document.cookie = "IBERIACOM_SSO_REFRESH_TO=".concat(getDateFormat(exRefsh, true), ";path=/;expires=").concat(new Date(exRefsh).toGMTString(), ";secure=").concat(scheme, ";");
      if (resp.access_token) {
        const token = JSON.parse(atob(resp.access_token.split('.')[1]));
        if (token !== undefined && token.realm_access !== undefined && token.realm_access.roles.length > 0) {
          if (token.realm_access.roles.filter(el => {
            return el === 'ROLE_IBERIA_ZERO';
          }).length > 0) {
            document.cookie = "IBERIACOM_SSO_TYPE=IBZERO;path=/;expires=".concat(new Date(isLogged.refreshTokenSFExpire).toGMTString(), ";secure=").concat(scheme, ";");
          } else {
            document.cookie = "IBERIACOM_SSO_TYPE=IBPLUS;path=/;expires=".concat(new Date(isLogged.refreshTokenSFExpire).toGMTString(), ";secure=").concat(scheme, ";");
          }
        }
      }
      if (isLogged.isSoftUser) {
        setLocalStorageValue('IB_PERMANENT_LOGIN', 'true');
        removeSessionStorageValue('retrieveMemberDetailV2');
      }
      setSessionStorageValue('accessToken', resp.access_token);
      removeSessionStorageValue('anonymousToken');
      resolve(resp);
    };
    const serviceFailure = resp => {
      reject(resp);
    };
    callService(tokenURL, headers, params, 'POST').then(serviceSuccess, serviceFailure);
  });
};

/**
 * Get a new anonymous token for the user, as a promise.
 */
function getAnonymousTokenPromise() {
  return new Promise((resolve, reject) => {
    generateAnonymousToken(tokenURL, globalAppToken).done(res => {
      setSessionStorageValue('anonymousToken', res.access_token);
      resolve(res);
    }).fail(err => {
      reject(err);
    });
  });
}
const refreshToken = (globalAppToken, tokenURLService) => {
  const deferred = $.Deferred();
  const isLogged = isLogado();
  const refreshTokenTxt = isLogged.userLogged ? isLogged.refreshTokenTxt : null;
  const refreshTokenExpiration = isLogged.userLogged ? isLogged.refreshTokenExpire : null;

  // Call to refresh token keycloack service
  const getRefreshToken = () => {
    const refreshTokenPromise = refreshLoggedToken(tokenURLService, globalAppToken, refreshTokenTxt);
    refreshTokenPromise.done(tokenData => {
      // update cookies with new values
      const date = new Date();
      const exAcc = date.getTime() + (tokenData.expires_in > 0 ? tokenData.expires_in * 1000 : 3600 * 1000);
      const exRefsh = date.getTime() + (tokenData.refresh_expires_in > 0 ? tokenData.refresh_expires_in * 1000 : 86400000);
      // A day. If It do not come in the service.

      const cookieAccess = isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO' ? 'IBERIACOM_SSO_ACCESS' : 'IBERIACOM_SSO_ONB_ACCESS';
      const cookieAccessTo = isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO' ? 'IBERIACOM_SSO_ACCESS_TO' : 'IBERIACOM_SSO_ONB_ACCESS_TO';
      const cookieRefresh = isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO' ? 'IBERIACOM_SSO_REFRESH' : 'IBERIACOM_SSO_ONB_REFRESH';
      const cookieRefreshTo = isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO' ? 'IBERIACOM_SSO_REFRESH_TO' : 'IBERIACOM_SSO_ONB_REFRESH_TO';
      const scheme = window.location.protocol === 'https:';
      Cookies.set(cookieAccess, tokenData.access_token, {
        path: '/',
        expires: new Date(exAcc),
        secure: scheme,
        sameSite: 'strict'
      });
      Cookies.set(cookieAccessTo, getDateFormat(exAcc, true), {
        path: '/',
        expires: new Date(exAcc),
        secure: scheme,
        sameSite: 'strict'
      });
      Cookies.set(cookieRefresh, tokenData.refresh_token, {
        path: '/',
        expires: new Date(exRefsh),
        secure: scheme,
        sameSite: 'strict'
      });
      Cookies.set(cookieRefreshTo, getDateFormat(exRefsh, true), {
        path: '/',
        expires: new Date(exRefsh),
        secure: scheme,
        sameSite: 'strict'
      });
      if (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') {
        setSessionStorageValue('accessToken', tokenData.access_token);
      } else {
        setSessionStorageValue('accessTokenOB', tokenData.access_token);
      }
      removeSessionStorageValue('anonymousToken');
      deferred.resolve();
    });
    refreshTokenPromise.fail(() => {
      generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
        deleteloggedcookies();
        removeSessionStorageValue('accessToken');
        removeSessionStorageValue('accessTokenOB');
        setSessionStorageValue('anonymousToken', tokenResponse.access_token);
        deferred.resolve();
      });
    });
  };
  if (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') {
    const refreshTokenSalesforceTxt = isLogged.userLogged ? isLogged.refreshTokenSF : null;
    // Siempre que haya caducado un token tanto de Keycloack como Salesforce se refrescan TODOS los tokens
    if (isLogged.userLogged) {
      // Si se cumple el usuario pasa a ser  Soft (largo término)
      if (isLogged.isSoftUser) {
        getAnonymousTokenPromise().then(() => refreshAccessTokenSaleforce()).then(data => {
          const response = data;
          response.refresh_token = refreshTokenSalesforceTxt;
          setCookiesSalesforce(response).then(() => {
            setTokenKeycloack('soft_user').then(() => {
              deferred.resolve();
            }).catch(() => {
              generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
                deleteloggedcookies();
                removeSessionStorageValue('accessToken');
                removeSessionStorageValue('accessTokenOB');
                setSessionStorageValue('anonymousToken', tokenResponse.access_token);
                deferred.resolve();
              }).fail(() => {
                deferred.resolve();
              });
              ;
            });
          }).catch(() => {
            deferred.resolve();
          });
          // Se setean las cookies de Keycloack para acabar de refrecar todos los tokens
        }).catch(() => {
          // TODO IDENTITY Generar token anónimo?
          generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
            deleteloggedcookies();
            removeSessionStorageValue('accessToken');
            removeSessionStorageValue('accessTokenOB');
            setSessionStorageValue('anonymousToken', tokenResponse.access_token);
            deferred.resolve();
          });
        });
      } else {
        setTokenKeycloack().then(() => {
          deferred.resolve();
        }).catch(() => {
          // Refresco de token de saleforce
          getAnonymousTokenPromise().then(() => refreshAccessTokenSaleforce()).then(resp => ({
            ...resp,
            refresh_token: refreshTokenSalesforceTxt
          })).then(data => setCookiesSalesforce(data)).then(() => setTokenKeycloack(isLogged.isSoftUser ? "soft_user" : undefined)).then(() => {
            deferred.resolve();
          }).catch(() => generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
            deleteloggedcookies();
            removeSessionStorageValue("accessToken");
            removeSessionStorageValue("accessTokenOB");
            setSessionStorageValue("anonymousToken", tokenResponse.access_token);
            deferred.resolve();
          }).fail(() => {
            deferred.resolve();
          }));
        });
      }
    }
  } else if (refreshTokenTxt && !isTokenExpired(refreshTokenExpiration)) {
    getRefreshToken();
  } else {
    generateAnonymousToken(tokenURL, globalAppToken).done(tokenResponse => {
      deleteloggedcookies();
      removeSessionStorageValue('accessToken');
      removeSessionStorageValue('accessTokenOB');
      setSessionStorageValue('anonymousToken', tokenResponse.access_token);
      deferred.resolve();
    });
  }
  return deferred.promise();
};

/**
 * @description Refresh access token saleforce
 * @see https://transform.atlassian.net/browse/CPA-291
 * @returns {Promise} 
 */

function refreshAccessTokenSaleforce() {
  const isLogged = isLogado();
  const refreshTokenSalesforceTxt = isLogged.userLogged ? isLogged.refreshTokenSF : null;
  const ibplusRefreshTokenURL = "".concat(loginMicroserviceUrl, "rs/v1/token/salesforce-token");
  const params = {
    refresh_token: refreshTokenSalesforceTxt,
    grant_type: "refresh_token"
  };
  const headers = {
    Authorization: "Bearer ".concat(getSessionStorageValue('anonymousToken'))
  };
  return fetch(ibplusRefreshTokenURL, {
    body: new (url_search_params_default())(params),
    method: "POST",
    headers
  }).then(res => res.json()).catch(err => Promise.reject(err));
}

// Control errors with promise service call
const wait = ms => new Promise(r => setTimeout(r, ms));
function refreshTokenPromise() {
  return new Promise((resolve, reject) => {
    refreshToken(globalAppToken, tokenURL).then(resp => resolve(resp)).catch(err => {
      reject(err);
    });
  });
}
function serviceCallWithRefresh(operation) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  let retries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : common.MAX_ATTEMPS;
  return new Promise((resolve, reject) => {
    operation().then(resp => resolve(resp)).catch(reason => {
      if (retries > 0) {
        if (reason.status === 401) {
          refreshTokenPromise().then(serviceCallWithRefresh.bind(null, operation, delay, retries - 1)).then(resp => resolve(resp)).catch(err => {
            reject(err);
          });
        }
        if (reason.status === 408) {
          wait(delay).then(retryOperation.bind(null, operation, delay, retries - 1)).then(resolve).catch(reject);
        }
        reject(reason);
      }
      reject(reason);
    });
  });
}
//

const getCustomerDataSession = () => {
  const isLogged = isLogado();
  if (isLogged.userLogged) {
    if (isLogged.userType === 'OB') return getSessionStorageValue('customerDataOB');
    if (isLogged.userType === 'IBZERO') return getSessionStorageValue('customerDataZero');
    return getSessionStorageValue('customerData');
  }
  return null;
};
const callGetCustomerData = (serviceUrl, authorizationToken, language) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': language,
    Authorization: "Bearer ".concat(authorizationToken)
  };
  return $.ajax({
    url: serviceUrl,
    xhrFields: {
      withCredentials: true
    },
    type: 'GET',
    headers
  });
};
const getCustomerDataService = (serviceUrl, authorizationToken, language) => {
  const deferred = $.Deferred();
  if (serviceUrl.indexOf('{memberId}') >= 0) {
    deferred.reject({
      status: 401
    });
  } else {
    callGetCustomerData(serviceUrl, authorizationToken, language).done(data => {
      deferred.resolve(data);
    }).fail(error => {
      deferred.reject({
        status: error.status,
        data: error.responseJSON
      });
    });
  }
  return deferred.promise();
};
const getCustomerDataServiceRetries = (serviceUrl, authorizationToken, language, currentAttemps) => {
  const deferred = $.Deferred();
  if (serviceUrl.indexOf('{memberId}') >= 0) {
    deferred.reject({
      status: 401
    });
  } else {
    callServiceRetries(serviceUrl, authorizationToken, language, currentAttemps);
  }
  function callServiceRetries(serviceUrl, authorizationToken, language, currentAttemps) {
    callGetCustomerData(serviceUrl, authorizationToken, language).done(data => {
      deferred.resolve(data);
    }).fail(error => {
      // error 503 y code PRLM_MBM_1007 - reintentos
      if (error.status == 503 && error.responseJSON.errors[0].code == 'PRLM_MBM_1007' && currentAttemps < common.MAX_ATTEMPS) {
        callServiceRetries(serviceUrl, authorizationToken, language, currentAttemps + 1);
      } else {
        deferred.reject({
          status: error.status,
          data: error.responseJSON
        });
      }
    });
  }
  return deferred.promise();
};
const getCustomerDataZero = (token, salesforceTK, language) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': language,
    Authorization: "Bearer ".concat(token),
    'X-Salesforce-Token': salesforceTK
  };
  return Promise.all([callService(customerZeroPersonal, headers), callService(customerZeroContact, headers)]);
};
const sendLogoutInfo = () => {
  try {
    if (window.BroadcastChannel) {
      var _ref, _SessionStorage$get3;
      const broadcastChannel = new window.BroadcastChannel('ib-idt-channel');
      broadcastChannel.postMessage({
        type: 'LOGOUT',
        payload: {
          anonymousToken: (_ref = (_SessionStorage$get3 = getSessionStorageValue('anonymousTokenForService')) !== null && _SessionStorage$get3 !== void 0 ? _SessionStorage$get3 : getSessionStorageValue('anonymousToken')) !== null && _ref !== void 0 ? _ref : null
        }
      });
      broadcastChannel.close();
    }
  } catch (e) {}
};

/* Logout IBPlus */
const logoutIBPlusService = () => {
  const deferred = $.Deferred();
  // Legacy mode  (Old platform) if boolean true, IBIS if false
  function removeLoggedInfo() {
    deleteloggedcookies();
    removeAvatarEvent();
    removeSessionStorageValue('accessToken');
    removeSessionStorageValue('customerData');
    removeSessionStorageValue('retrieveMemberDetailV2');
    removeSessionStorageValue('ib-check-in-app.customerData');
    removeSessionStorageValue('ib-check-in-app.loggedInfo');
    removeSessionStorageValue('ib-check-in-app.userLoggedBookingInfo');
    removeSessionStorageValue('ib-MmB-app.bookingsList');
    removeSessionStorageValue('ib-MmB-app.customerData');
    removeSessionStorageValue('ib-booking-app.customerData');
    removeSessionStorageValue('ib-avios-calculator-app.customerData');
    removeSessionStorageValue('ib-avios-calculator-app.loggedToken');
    removeSessionStorageValue('ib-avios-calculator-app.refreshToken');
    removeSessionStorageValue('ib-avios-calculator-app.userLogged');
    removeSessionStorageValue('ib-plus-app.customerData');
    removeSessionStorageValue('ib-plus-app.loggedToken');
    removeSessionStorageValue('ib-plus-app.refreshToken');
    removeSessionStorageValue('ib-plus-app.userLogged');
    removeSessionStorageValue('ib-plus-app.username');
    removeSessionStorageValue('ib-plus-app.typeOfCard');
    removeSessionStorageValue('ib-plus-app.linksList');
    removeSessionStorageValue('urlUpgradeRedirect');
  }
  function callSalesForceLogout() {
    const sfTokenRefresh = Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const url = "".concat(salesforceURL, "revoke");
    const params = {
      token: sfTokenRefresh
    }; // NOTA -> parece que no es necesario el client_id o client_secret
    return new Promise((resolve, reject) => {
      if (!sfTokenRefresh) {
        reject();
      } else {
        callService(url, headers, params, 'POST').always(response => {
          resolve(response);
        });
      }
    });
  }
  function callLogoutService() {
    const rToken = Cookies.get('IBERIACOM_SSO_REFRESH') || '';
    const aToken = Cookies.get('IBERIACOM_SSO_ACCESS') || '';
    if (rToken.length > 0) {
      const key = atob(globalAppToken).split(':');
      const params = $.param({
        refresh_token: rToken,
        client_id: key[0],
        client_secret: key[1]
      });
      const ibplusLogoutURL = $('#loggedUserDefaults').attr('data-inte-ibpluslogoutURL');
      const headers = {
        Authorization: "Bearer ".concat(aToken),
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      callSalesForceLogout().then(() => {
        callService(ibplusLogoutURL, headers, params, 'POST').always(() => {
          sendLogoutInfo();
          removeLoggedInfo();
          deferred.resolve();
        });
      }).catch(() => {
        sendLogoutInfo();
        removeLoggedInfo();
        deferred.resolve();
      });
    } else {
      // If refresh token is already expired - User is not logged
      removeLoggedInfo();
      deferred.reject();
    }
  }
  callLogoutService();
  return deferred.promise();
};

/**
 * Return FF of user - Decode token access to retrieve information
 */
const getMemberIdByToken = () => {
  let infoToken;
  let idUser = '{memberId}';
  let _isLogado = isLogado(),
    accessToken = _isLogado.accessToken;
  if (accessToken !== null && accessToken !== undefined && accessToken !== "") {
    // eslint-disable-next-line prefer-destructuring
    accessToken = accessToken.split('.')[1];
    infoToken = decodeURIComponent(escape(window.atob(accessToken)));
    infoToken = JSON.parse(infoToken);
    idUser = infoToken.preferred_username;
  }
  return idUser;
};
const getMemberData = (authorizationToken, language, userType) => {
  const deferred = $.Deferred();
  let userInfo;
  let currentAttemps = 0;
  let segment = 0;
  let preferredLanguage;
  let surNames;
  let email;
  const dumboInfo = {
    tier: '',
    bonusCode: '',
    bonusDiscount: ''
  };

  /**
   * Function to return unique promise (Case service failed and retried attempt)
   * @param {*} authorizationToken Token refreshed
   * @param {*} language
   * @param {*} userType IBPLUS or OB
   */
  function getMemberDataInside(authorizationToken, language, userType) {
    /**
    * Set customerData variable of SessionStorage with information of IBPlus customer
    * @param {*} dataMDv2 Response of Retrieve Member Detail Service V2
    * unified:
    *  dataMD - Response of Retrieve Member Detail Service (personal info)
    *  dataLA - Response of List Account Service (balance of avios)
    *  dataLS - Response of List Schemes With Tiers Service (category info)
    *  dataPD - Response of Partners Programme Dumbo Service (list of partners associated for a member)
    */
    function setMemberIBPlusInfoV2(dataMDv2) {
      var _dataMDv2$memberPerso, _dataMDv2$memberPerso2;
      let documentId;
      let address;
      let number;
      let numberExtra;
      let postalCode;
      let category = 'CLASICA';
      let aviosBalance;

      //preferredLanguage
      if (dataMDv2.memberPersonalDetails.person.locale != null) {
        preferredLanguage = dataMDv2.memberPersonalDetails.person.locale.toUpperCase();
      }
      const lastName = dataMDv2.memberPersonalDetails.person.personName.familyName != null ? toTitleCase(dataMDv2.memberPersonalDetails.person.personName.familyName) : '';
      surNames = lastName;
      if (dataMDv2.memberPersonalDetails.person.personName.secondFamilyName != null) {
        surNames += " ".concat(toTitleCase(dataMDv2.memberPersonalDetails.person.personName.secondFamilyName));
      }
      if (dataMDv2.memberPersonalDetails.person.emailAddress.email != null) {
        email = dataMDv2.memberPersonalDetails.person.emailAddress.email;
      }
      //registeredIdentifiers
      if (dataMDv2.memberPersonalDetails.person.registeredIdentifiers != null) {
        const documentDNI = dataMDv2.memberPersonalDetails.person.registeredIdentifiers.find(document => document.type.toUpperCase() === 'NATIONALITY ID');
        if (documentDNI != null) {
          documentId = documentDNI.token;
        } else {
          const documentPassport = dataMDv2.memberPersonalDetails.person.registeredIdentifiers.find(document => document.type.toUpperCase() === 'PASSPORT');
          if (documentPassport != null) {
            documentId = documentPassport.token;
          }
        }
      }
      //postalAddresses
      if (dataMDv2.memberPersonalDetails.person.postalAddresses != null) {
        const addressPreference = dataMDv2.memberPersonalDetails.person.postalAddresses.find(postal => postal.preferenceIndicator === true);
        if (addressPreference != null && addressPreference.addressLines != null) {
          address = addressPreference.addressLines[0] != null ? addressPreference.addressLines[0] : '';
          number = addressPreference.addressLines[1] != null ? addressPreference.addressLines[1] : '';
          numberExtra = addressPreference.addressLines[2] != null ? addressPreference.addressLines[2] : '';
          postalCode = addressPreference.postCode ? addressPreference.postCode : '';
        }
      }
      const schemeBasic = dataMDv2.memberPersonalDetails.schemes.find(scheme => scheme.schemeIdentifier.toUpperCase() === 'BASIC');
      if (schemeBasic != null) {
        category = schemeBasic.recognitionLevel.recognitionLevelIdentifier;
      }
      if (dataMDv2.accounts.length > 0) {
        const aviosReward = dataMDv2.accounts.find(account => account.type.toUpperCase() === 'REWARD');
        const aviosTotalReward = dataMDv2.accounts.find(account => account.type.toUpperCase() === 'TOTAL_REWARD');
        const aviosLoan = dataMDv2.accounts.find(account => account.type.toUpperCase() === 'LOAN');
        let reward = aviosReward.balance.amount;
        let total_Reward = aviosTotalReward.balance.amount;
        let loan = aviosLoan.balance.amount;
        let loanOutstanding = false;
        if (aviosLoan && aviosLoan.outstandingLoan && aviosLoan.outstandingLoan.amount && aviosLoan.outstandingLoan.amount > 0) {
          loan = -aviosLoan.outstandingLoan.amount;
          loanOutstanding = true;
        }
        aviosBalance = total_Reward;
        if (aviosReward && aviosReward.balance.amount === 0 && loanOutstanding) {
          aviosBalance = loan;
        }
      }
      switch (category) {
        case 'CLASICA':
          segment = 2;
          break;
        case 'PLATA':
          segment = 4;
          break;
        case 'ORO':
          segment = 1;
          break;
        case 'PLATINO':
          segment = 3;
          break;
        case 'INFINITA':
          segment = 3;
          break;
        case 'INFINITA PRIME':
          segment = 3;
          break;
        default:
          segment = 2;
      }
      // FF CPA-140
      const identifier = dataMDv2.memberPersonalDetails.identifier;
      userInfo = {
        segment,
        category: category.replace(/\s/g, ''),
        id: identifier != null ? identifier.replace(/^0+/, "").replace(/^[*]{6}/, "") : '',
        idComplete: identifier != null ? identifier : '',
        name: dataMDv2.memberPersonalDetails.person.personName.firstName != null ? toTitleCase(dataMDv2.memberPersonalDetails.person.personName.firstName) : '',
        surname: lastName,
        surnames: surNames,
        documentId,
        email,
        avios: aviosBalance,
        preferredLanguage,
        address,
        number,
        numberExtra,
        postalCode,
        //completeProfile
        completeProfile: dataMDv2.memberPersonalDetails.profileStatus === 'FULL',
        // PARTIAL or FULL
        parentalControl: dataMDv2.memberPersonalDetails.otherStatuses.isRedemptionEnabled != null ? dataMDv2.memberPersonalDetails.otherStatuses.isRedemptionEnabled : '',
        termsAndConditions: !!dataMDv2.memberPersonalDetails.termsAndConditions,
        dataMarket: ibe_logged_service_marketg,
        dataLanguage: ibe_logged_service_localeg,
        partnersInfo: dataMDv2.partners,
        hashEID: (_dataMDv2$memberPerso = dataMDv2 === null || dataMDv2 === void 0 || (_dataMDv2$memberPerso2 = dataMDv2.memberPersonalDetails) === null || _dataMDv2$memberPerso2 === void 0 || (_dataMDv2$memberPerso2 = _dataMDv2$memberPerso2.person) === null || _dataMDv2$memberPerso2 === void 0 || (_dataMDv2$memberPerso2 = _dataMDv2$memberPerso2.emailAddress) === null || _dataMDv2$memberPerso2 === void 0 ? void 0 : _dataMDv2$memberPerso2.hashEID) !== null && _dataMDv2$memberPerso !== void 0 ? _dataMDv2$memberPerso : null
      };
      setSessionStorageValue('customerData', userInfo);
      setSessionStorageValue('accessToken', Cookies.get('IBERIACOM_SSO_ACCESS'));
    }

    /**
     * Set customerDataOB variable of SessionStorage with information of OnBusiness customer
     * @param {*} data Response of service customer OB
     */
    function setMemberOBInfo(data) {
      const lastName = toTitleCase(data.userInfo.lastName);
      let companyName;
      let CIF;
      let companyCountry;
      if (data.userInfo.lastName != null) {
        surNames = lastName;
        if (data.userInfo.secondLastName != null) {
          surNames += " ".concat(toTitleCase(data.userInfo.secondLastName));
        }
      }
      if (data.userInfo.email != null) {
        email = toTitleCase(data.userInfo.email);
      }
      if (data.userInfo.preferredLanguage != null) {
        switch (data.userInfo.preferredLanguage) {
          case 'SPA':
            preferredLanguage = 'ES';
            break;
          case 'ENG':
            preferredLanguage = 'EN';
            break;
          case 'CAT':
            preferredLanguage = 'CA';
            break;
          default:
            preferredLanguage = '';
            break;
        }
      }
      if (data.companyInfo.companyName != null) {
        companyName = toTitleCase(data.companyInfo.companyName);
      }
      if (data.companyInfo.address != null) {
        companyCountry = data.companyInfo.address.country.toUpperCase();
      }
      if (data.companyInfo.companyId != null) {
        CIF = toTitleCase(data.companyInfo.companyId);
      }
      switch (data.tierStatus.status) {
        case 'On2':
          segment = 12;
          break;
        case 'On3':
          segment = 13;
          break;
        default:
          segment = 11;
      }

      //SHOW/HIDE "EQUIPO" SECTION ON USER MENU
      if (data.userInfo.role.code == "I_COMP_ADM" || data.userInfo.role.code == "I_COMP_AUT") {
        $("#tool_loggedOB .link__regular.link-equipo").removeClass("hidden");
      }
      userInfo = {
        segmento: segment,
        rolCode: data.userInfo.role.code,
        rolCIP: data.userInfo.role.description,
        userID: data.clid,
        name: toTitleCase(data.userInfo.firstName),
        surname: lastName,
        surnames: surNames,
        email,
        preferredLanguage,
        puntos: data.memberBalance,
        publicis: companyName,
        country: companyCountry,
        CIF,
        EstadoUsuario: 'logado_pyme',
        NivelUsuario: data.tierStatus.status,
        dataLanguage: ibe_logged_service_localeg
      };
      setSessionStorageValue('customerDataOB', userInfo);
      setSessionStorageValue('accessTokenOB', Cookies.get('IBERIACOM_SSO_ONB_ACCESS'));
    }
    function setMemberZeroInfo(data) {
      const personal = data[0];
      const contact = data[1];
      const userData = {
        name: personal.name != null ? toTitleCase(personal.name) : '',
        surnames: personal.lastName != null ? toTitleCase(personal.lastName) : '',
        email: contact.email,
        hashEID: contact.hashEID,
        userType: 'IBZERO'
      };
      setSessionStorageValue('customerDataZero', userData);
      setSessionStorageValue('accessToken', Cookies.get('IBERIACOM_SSO_ACCESS'));
    }

    /**
     * Retry request to service (until 3 twices)
     * @param {*} error Response of service
     * @param {*} userType Type of user failed
     * @param {*} tokenURL URL token service failed
     */
    function failRetrieveMember(error, userType, tokenURL) {
      $('#publicUser').removeClass('hidden');
      if (isSessionStorageWritable() === true) {
        if (error.status === 401) {
          if (currentAttemps < common.MAX_ATTEMPS) {
            currentAttemps += 1;
            // Refresh the token
            refreshToken(globalAppToken, tokenURL).done(() => {
              if (getSessionStorageValue('anonymousToken') == null) {
                getAppToken(globalAppToken, tokenURL).done(tokenData => {
                  getMemberDataInside(tokenData, language, userType);
                });
              } else {
                removeSessionStorageValue('retrieveMemberDetailV2');
                removeSessionStorageValue('accessToken');
                removeSessionStorageValue('accessTokenOB');
                deleteloggedcookies();
                Cookies.set('JSESSIONID', '', {
                  path: '/',
                  sameSite: 'strict'
                });
                deferred.reject();
              }
            });
          } else {
            deferred.reject();
          }
        } else {
          deferred.reject();
        }
      } else {
        callModalwcs(ibe_logged_service_localeg, ibe_logged_service_marketg, 'CustomLink_C', $('header.ibe-header').attr('data-msg-service-error'), '', '', '#', false);
        deferred.reject();
      }
    }
    if (userType === 'OB') {
      /** Call Get Onbusiness Membership service */
      const getCustomerDataPromise = getCustomerDataService(customerDataServiceOB, authorizationToken, language);
      getCustomerDataPromise.done(data => {
        setMemberOBInfo(data);
        deferred.resolve();
      });
      getCustomerDataPromise.fail(error => {
        failRetrieveMember(error, 'OB', tokenUrlOB);
      });
    } else if (userType === 'IBZERO') {
      const sfToken = Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
      getCustomerDataZero(authorizationToken, sfToken, language).then(data => {
        setSessionStorageValue('retrieveMemberDetailZero', data);
        if (data[1].email) {
          digestSHA256(data[1].email).then(hashEID => {
            data[1].hashEID = hashEID;
            setMemberZeroInfo(data);
            deferred.resolve();
          }, () => {
            setMemberZeroInfo(data);
            deferred.resolve();
          });
        } else {
          setMemberZeroInfo(data);
          deferred.resolve();
        }
      }).catch(error => {
        failRetrieveMember(error, 'IBZERO', tokenUrlOB);
      });
    } else if (userType === 'IBPLUS' && getSessionStorageValue('retrieveMemberDetailV2')) {
      var _memberDetailSessionV, _memberDetailSessionV2;
      const memberDetailSessionV2 = getSessionStorageValue('retrieveMemberDetailV2');
      const mail = (_memberDetailSessionV = memberDetailSessionV2 === null || memberDetailSessionV2 === void 0 || (_memberDetailSessionV2 = memberDetailSessionV2.memberPersonalDetails) === null || _memberDetailSessionV2 === void 0 || (_memberDetailSessionV2 = _memberDetailSessionV2.person) === null || _memberDetailSessionV2 === void 0 || (_memberDetailSessionV2 = _memberDetailSessionV2.emailAddress) === null || _memberDetailSessionV2 === void 0 ? void 0 : _memberDetailSessionV2.email) !== null && _memberDetailSessionV !== void 0 ? _memberDetailSessionV : '';
      if (mail.length > 0) {
        digestSHA256(mail).then(hashEID => {
          memberDetailSessionV2.memberPersonalDetails.person.emailAddress.hashEID = hashEID;
          setMemberIBPlusInfoV2(memberDetailSessionV2);
          deferred.resolve();
        }, () => {
          setMemberIBPlusInfoV2(memberDetailSessionV2);
          deferred.resolve();
        });
      } else {
        setMemberIBPlusInfoV2(memberDetailSessionV2);
        deferred.resolve();
      }
    } else if (userType === 'IBPLUS') {
      /** Call diferents services to retrieve member info */
      const userId = getMemberIdByToken();

      /** Retrieve Member Detail Service V2 */
      const serviceRetrieveMemberDetailV2 = retrieveMemberDetailV2 + userId;
      // 3 reintentos para retrieveMemberDetailV2 IBPLUS
      const retrieveMemberDetailV2Prom = getCustomerDataServiceRetries(serviceRetrieveMemberDetailV2, authorizationToken, language, 0);
      retrieveMemberDetailV2Prom.then(dataMDv2 => {
        var _dataMDv2$memberPerso3, _dataMDv2$memberPerso4;
        setSessionStorageValue('retrieveMemberDetailV2', dataMDv2);
        const mail = (_dataMDv2$memberPerso3 = dataMDv2 === null || dataMDv2 === void 0 || (_dataMDv2$memberPerso4 = dataMDv2.memberPersonalDetails) === null || _dataMDv2$memberPerso4 === void 0 || (_dataMDv2$memberPerso4 = _dataMDv2$memberPerso4.person) === null || _dataMDv2$memberPerso4 === void 0 || (_dataMDv2$memberPerso4 = _dataMDv2$memberPerso4.emailAddress) === null || _dataMDv2$memberPerso4 === void 0 ? void 0 : _dataMDv2$memberPerso4.email) !== null && _dataMDv2$memberPerso3 !== void 0 ? _dataMDv2$memberPerso3 : '';
        if (mail.length > 0) {
          digestSHA256(mail).then(hashEID => {
            dataMDv2.memberPersonalDetails.person.emailAddress.hashEID = hashEID;
            setMemberIBPlusInfoV2(dataMDv2);
            deferred.resolve();
          }, () => {
            setMemberIBPlusInfoV2(dataMDv2);
            deferred.resolve();
          });
        } else {
          setMemberIBPlusInfoV2(dataMDv2);
          deferred.resolve();
        }
      }, error => {
        failRetrieveMember(error, 'IBPLUS', tokenURL);
      });
    } else {
      failRetrieveMember({}, 'IBPLUS', tokenURL);
    }
    return deferred.promise();
  }
  return getMemberDataInside(authorizationToken, language, userType);
};

/**
* @description Functions call to external service store session
* @param {urlService} Url of service to call
* @param {parameters} Params
* @returns {promise} resolve: response with the store session id
* reject: if something has gone wrong it returns the error
*/
const callServiceSSO = (urlService, parameters) => {
  const deferred = $.Deferred();
  const checkSSOPromise = round => {
    const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS') ? Cookies.get('IBERIACOM_SSO_ACCESS') : '';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: "Bearer ".concat(accessTokenTxt)
    };
    const roundAux = round || 0;
    if (roundAux <= common.MAX_ATTEMPS) {
      callService(urlService, headers, JSON.stringify(parameters), 'POST').done(data => {
        deferred.resolve(data);
      }).fail(error => {
        if (error.status === 401) {
          refreshToken(globalAppToken, tokenURL).always(() => {
            checkSSOPromise(roundAux + 1);
          });
        } else {
          deferred.reject();
        }
      });
    } else {
      deferred.reject();
    }
    return deferred.promise();
  };
  return urlService.length > 0 && parameters !== undefined && checkSSOPromise();
};

/*
 * Logic to check if the user is logged and return an object with the user information
 */

const loggedService = () => {
  const deferred = $.Deferred();
  const isLogged = isLogado();
  let getCusDatSes;
  let acccookie;
  let accSS;
  let tkURL;
  let accSalesforceSS;
  let accSalesforceCookie;
  function loggedServiceInside() {
    getCusDatSes = getCustomerDataSession();
    const removeUserInfo = () => {
      removeSessionStorageValue('customerData');
      removeSessionStorageValue('retrieveMemberDetailV2');
      removeSessionStorageValue('accessToken');
      removeSessionStorageValue('customerDataOB');
      removeSessionStorageValue('accessTokenOB');
    };
    if (isLogged.userType === 'OB') {
      acccookie = Cookies.get('IBERIACOM_SSO_ONB_ACCESS');
      accSS = getSessionStorageValue('accessTokenOB');
      tkURL = tokenUrlOB;
      if (getCusDatSes && getCusDatSes.dataLanguage !== ibe_logged_service_localeg) {
        getCusDatSes = null;
      }
    } else {
      if (getCusDatSes && (getCusDatSes.dataMarket !== ibe_logged_service_marketg || getCusDatSes.dataLanguage !== ibe_logged_service_localeg) && isLogged.userType === 'IBPLUS') {
        getCusDatSes = null;
        removeSessionStorageValue('retrieveMemberDetailV2');
      }
      acccookie = Cookies.get('IBERIACOM_SSO_ACCESS');
      accSS = getSessionStorageValue('accessToken');
      accSalesforceCookie = Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
      accSalesforceSS = getSessionStorageValue('accessTokenSalesforce');
      tkURL = tokenURL;
    }
    if (isLogged.userLogged && getCusDatSes == null && acccookie !== undefined) {
      getMemberData(acccookie, "".concat(ibe_logged_service_localeg, "-").concat(ibe_logged_service_marketg), isLogado().userType).done(() => {
        getCusDatSes = getCustomerDataSession();
        if (getCusDatSes == null) {
          deleteloggedcookies();
          deferred.reject();
        } else {
          if (digital_data.Quadrigam === 'IBCAPS') {
            window.location.href = "/".concat(ibe_logged_service_marketg.toLowerCase(), "/").concat(ibe_logged_service_localeg.toLowerCase(), "/");
          }
          deferred.resolve();
        }
      }).fail(() => {
        removeSessionStorageValue('customerData');
        removeSessionStorageValue('retrieveMemberDetailV2');
        removeSessionStorageValue('accessToken');
        removeSessionStorageValue('customerDataOB');
        removeSessionStorageValue('accessTokenOB');
        deleteloggedcookies();
        deferred.reject();
      });
    } else if (isLogged.userLogged && getCusDatSes !== null && accSS === acccookie && accSalesforceSS === accSalesforceCookie) {
      if (digital_data.Quadrigam === 'IBCAPS' && !(getLocalStorageValue('IB_PERMANENT_LOGIN') === 'true')) {
        window.location.href = "/".concat(ibe_logged_service_marketg.toLowerCase(), "/").concat(ibe_logged_service_localeg.toLowerCase(), "/");
      }
      deferred.resolve();
    } else if (isLogged.userLogged && (getCusDatSes !== null && (accSS !== acccookie || accSalesforceSS !== accSalesforceCookie) || getCusDatSes == null)) {
      // Refresh Salesforce and Keycloack Token
      removeUserInfo();
      refreshToken(globalAppToken, tkURL).done(() => {
        if (getSessionStorageValue('anonymousToken') == null) {
          getAppToken(globalAppToken, tokenURL).done(tokenData => {
            getMemberData(tokenData, "".concat(ibe_logged_service_localeg, "-").concat(ibe_logged_service_marketg), isLogado().userType).done(() => {
              getCusDatSes = getCustomerDataSession();
              if (getCusDatSes == null) {
                deleteloggedcookies();
                deferred.reject();
              } else {
                if (digital_data.Quadrigam === 'IBCAPS') {
                  window.location.href = "/".concat(ibe_logged_service_marketg.toLowerCase(), "/").concat(ibe_logged_service_localeg.toLowerCase(), "/");
                }
                deferred.resolve();
              }
            }).fail(() => {
              deleteloggedcookies();
              deferred.reject();
            });
          }).fail(() => {
            deleteloggedcookies();
            deferred.reject();
          });
        } else {
          removeUserInfo();
          deleteloggedcookies();
          Cookies.set('JSESSIONID', '', {
            path: '/',
            sameSite: 'strict'
          });
          deferred.reject();
        }
      }).fail(() => {
        deleteloggedcookies();
        deferred.reject();
      });
    } else {
      deleteloggedcookies();
      removeSessionStorageValue('customerData');
      removeSessionStorageValue('retrieveMemberDetailV2');
      removeSessionStorageValue('accessToken');
      removeSessionStorageValue('customerDataOB');
      removeSessionStorageValue('accessTokenOB');
      deferred.reject();
    }
    return deferred.promise();
  }
  return loggedServiceInside();
};

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.for-each.js
var esnext_iterator_for_each = __webpack_require__("./node_modules/core-js/modules/esnext.iterator.for-each.js");
;// ./dev/js/inte-modules/ibe-modules/general/ibe_visitor-data.js





/**
 * @description Get the  user information necessary to pass to the segmentation function.
 * @returns JSON Object.
 */
function getVisitorData() {
  // Variable save parameters Data
  let segmentationParams = $('[data-SegmentationParams]').attr('data-SegmentationParams');
  segmentationParams = segmentationParams ? JSON.parse(segmentationParams).params : [];
  const visitorParams = {};
  function lookUpCookie(element) {
    let cookieVal;
    // OnBusiness
    if (element.paramName === 'lgOB') {
      cookieVal = Cookies.get('IBERIACOM_SSO_CIP'); // Boolean cookie
    } else {
      cookieVal = Cookies.get(element.paramName);
    }
    if (cookieVal) {
      // if exist or true
      visitorParams[element.paramName] = cookieVal;
    }
  }
  function lookUpSessionStorage(element) {
    let storageVal;
    // IBPlus Log in case
    if ((element.paramName === 'logadoIBPlus' || element.paramName === 'numAvios' || element.paramName === 'nvIBP' || element.paramName === 'isSantaderOne') && !lookUpSessionStorage.ibplusSet) {
      storageVal = getSessionStorageValue('customerData');
      if (storageVal) {
        visitorParams.logadoIBPlus = true;
        if (storageVal.category) {
          visitorParams.nvIBP = storageVal.category;
        }
        if (storageVal.dumboInfo && storageVal.dumboInfo.tier && storageVal.dumboInfo.tier.length > 0) {
          visitorParams.isSantaderOne = true;
        }
        ;
        lookUpSessionStorage.ibplusSet = true;
      }
    } else if (element.paramName === 'lgOB' && getSessionStorageValue('customerDataOB')) {
      visitorParams[element.paramName] = 'true';
    } else if (element.paramName === 'logadoIBZero' && getSessionStorageValue('customerDataZero')) {
      visitorParams[element.paramName] = 'true';
    } else {
      // General case
      storageVal = getSessionStorageValue(element.paramName);
      if (storageVal) {
        visitorParams[element.paramName] = storageVal;
      }
    }
  }
  function lookUpURL(element) {
    let urlParams = window.location.search;
    const pattern = new RegExp('[&?]+');
    urlParams = urlParams.split(pattern).filter(el => el.length > 0);
    let tupla;
    urlParams.forEach(el => {
      tupla = el.split('=');
      if (element.paramName === tupla[0] && tupla[1]) {
        visitorParams[element.paramName] = tupla[1];
      }
    });
  }
  segmentationParams.forEach(element => {
    switch (element.retrieveFrom) {
      case 'Cookie':
        lookUpCookie(element);
        break;
      case 'Session Storage':
        lookUpSessionStorage(element);
        break;
      case 'URL':
        lookUpURL(element);
        break;
    }
  });
  return visitorParams;
}
/* harmony default export */ const ibe_visitor_data = (getVisitorData);
;// ./dev/js/inte-modules/ibe-modules/manage/ibe_offices.js



const ibe_offices_retrieveGlobalVariab = ibe_variables(),
  ibe_offices_localeg = ibe_offices_retrieveGlobalVariab.localeg,
  ibe_offices_marketg = ibe_offices_retrieveGlobalVariab.marketg;

/** loadOfficeResults
 * This functions call CSElement to load the HTML associated with
 * offices page
 */
function loadOfficeResults(city, country, visitorP) {
  const vp = Object.keys(visitorP).length ? JSON.stringify(visitorP) : undefined;
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Contact/Results',
      market: ibe_offices_marketg,
      locale: ibe_offices_localeg,
      cityIATA: city,
      countryIATA: country,
      visitorParams: vp,
      d: ''
    },
    beforeSend() {
      dFrontJs.ibe_loading.open('.inte-loadingOffice');
    },
    complete() {
      dFrontJs.ibe_loading.close('.inte-loadingOffice');
    },
    success(data) {
      $('.office_results').remove();
      $('.ibe-box-landing__terciary--office').append(data);
      if (responsive() !== 'desktop') {
        dFrontJs.ibe_scrollTop.scrollId('#resultsoffice-foco');
      }
    }
  });
}
/* harmony default export */ const ibe_offices = (loadOfficeResults);
;// ./dev/js/inte-modules/ibe-modules/general/ibe_segmentation.js









const ibe_segmentation_retrieveGlobalVariab = ibe_variables(),
  ibe_segmentation_localeg = ibe_segmentation_retrieveGlobalVariab.localeg,
  ibe_segmentation_marketg = ibe_segmentation_retrieveGlobalVariab.marketg;

/**
 * @description SEGMENTATION BY MARKET, LOCALE, LOGGED, ON BUSINESS.
 * @returns Dom modification through Ajax call.
 */
function dosegmentation() {
  /**
   * @description Reload offices module when user is logged
   */
  function officesSegmentation() {
    if ($('#resultsoffice-foco').length > 0) {
      const city = $('.inte-select-spain option:selected').val() ? $('.inte-select-spain option:selected').val() : undefined;
      const country = $('.inte-select-countries option:selected').val() ? $('.inte-select-countries option:selected').val() : undefined;
      const vParams = ibe_visitor_data();
      ibe_offices(city, country, vParams);
    }
  }
  if ($('[data-idforreco]').length) {
    const vParams = ibe_visitor_data();
    const quadrigamExcpts = ["OBPOSTLOG"];
    if (Object.keys(vParams).length || quadrigamExcpts.indexOf(quadrigam) != -1) {
      const idReco = {
        info: []
      };
      let obj = {};
      let inforeco;

      //Parametro de segmentación para criterio de usuario logado/anónimo
      vParams["logado"] = isLogado().userLogged.toString();
      $('[data-idforreco]').each(function loop() {
        inforeco = $(this).attr('data-info-reco');
        obj = inforeco ? JSON.parse(inforeco) : {};
        obj.id = $(this).attr('data-idforreco');
        obj.pageId = $('body').attr('data-contentid');
        idReco.info.push(obj);
      });
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl6h/BrowserCache3600/GetRecommendationsById',
          visitorParams: JSON.stringify(vParams),
          infoRecos: JSON.stringify(idReco),
          market: ibe_segmentation_marketg,
          locale: ibe_segmentation_localeg,
          d: ''
        },
        beforeSend() {
          $('[data-idforreco]').addClass('inte-loadingReco').prepend('<div data-loading="" class="ibe-loading__overlay inte-loadingReco">' + '<div class="ibe-loading__spinner">' + '<div class="ibe-loading__icon">' + '<div class="circle"></div>' + '<div class="circle"></div>' + '</div>' + '<div class="ibe-loading__text"></div>' + '</div>' + '</div>');
          dFrontJs.ibe_loading.open('.inte-loadingReco');
        },
        error() {
          dFrontJs.ibe_loading.close('.inte-loadingReco');
        },
        success(data) {
          dFrontJs.ibe_loading.close('.inte-loadingReco');
          const $recoHTML = $.parseHTML(data);
          let auxid;
          let auxHTML;
          $recoHTML.forEach(el => {
            auxid = $(el).attr('data-idforreco');
            $("[data-idforreco=".concat(auxid, "]")).each(function loop() {
              auxHTML = el.innerHTML;
              if (auxHTML.length) {
                if ($(this).data('info-reco')) {
                  if ($(this).data('info-reco').render === 'CSE') {
                    $(this).html(auxHTML).attr('class', $(this).attr('class'));
                    if ($(this).hasClass('slick-initialized')) {
                      $(this).removeClass('slick-initialized');
                      dFrontJs.ibe_carousel.init();
                      dFrontJs.ibe_carousel.calculateHeightTitle();
                    }
                    window.requestAnimFrame(() => {
                      dFrontJs.ibe_carousel.calculateHeightTitle();
                    });
                  }
                } else {
                  $(this).replaceWith(auxHTML);
                  if ($(this).find('[class^="ibe-tab"]').length) {
                    dFrontJs.ibe_tab.init();
                    $('[data-tab="bootstrap-tabdrop"]').trigger('resize');
                    const $fcHeight = $(this).find('[data-fc-height]');
                    if ($fcHeight.length) {
                      $fcHeight.each(function loopHeight() {
                        dFrontJs.app.calculateHeightComponents($(this)[0], false);
                      });
                    }
                  }
                  if ($("[data-slick='carrousel-gift-cards']", data).length > 0) {
                    dFrontJs.ibe_slick_gift_cards.init();
                  }
                }
              }
            });
          });
          $('[data-idforreco]').each(function loop() {
            $(this).removeAttr('data-idforreco').removeAttr('data-info-reco').removeClass('inte-loadingReco');
          });
          if ($('img[data-src]', data).length > 0 || $('source[data-src]', data).length > 0) {
            dFrontJs.app.inviewFunction();
          }
          // Init Accordion dada has any
          if ($('.ibe-accordion', data).length > 0) {
            dFrontJs.ibe_accordion.init();
            dFrontJs.ibe_bootstrap_collapse.init();
          }
          // Init Accordion dada has any
          if ($('.modal-link', data).length > 0) {
            dFrontJs.modalFunction.init();
          }
          // dispatch an event on document's body
          $(document.body).trigger('segmentationLoaded');
        }
      });
    }
  }
  if (isLogado().userLogged === true) {
    officesSegmentation();
  }
}
/* harmony default export */ const ibe_segmentation = (dosegmentation);
;// ./dev/js/inte-modules/ibe-modules/constants/ibe_idt_constants.js
/* eslint-disable import/prefer-default-export */

/**
 * Cookies keys for tokens
 */
const TOKEN_COOKIES_KEYS = {
  LOGGED_TOKEN: 'IBERIACOM_SSO_ACCESS',
  LOGGED_TOKEN_EXPIRATION: 'IBERIACOM_SSO_ACCESS_TO',
  LOGGED_REFRESH_TOKEN: 'IBERIACOM_SSO_REFRESH',
  LOGGED_REFRESH_TOKEN_EXPIRATION: 'IBERIACOM_SSO_REFRESH_TO',
  ONB_LOGGED_TOKEN: 'IBERIACOM_SSO_ONB_ACCESS',
  ONB_LOGGED_TOKEN_EXPIRATION: 'IBERIACOM_SSO_ONB_ACCESS_TO',
  ONB_LOGGED_REFRESH_TOKEN: 'IBERIACOM_SSO_ONB_REFRESH',
  ONB_LOGGED_REFRESH_TOKEN_EXPIRATION: 'IBERIACOM_SSO_ONB_REFRESH_TO',
  SF_LOGGED_TOKEN: 'IBERIACOM_SSO_ACCESS_SALESFORCE',
  SF_LOGGED_TOKEN_EXPIRATION: 'IBERIACOM_SSO_ACCESS_TO_SALESFORCE',
  SF_LOGGED_REFRESH_TOKEN: 'IBERIACOM_SSO_REFRESH_SALESFORCE',
  SF_LOGGED_REFRESH_EXPIRATION: 'IBERIACOM_SSO_REFRESH_TO_SALESFORCE'
};

/**
 * Constants to event name. Do not make magical strings.
 */
const EVENT_NAMES = {
  UPDATE_USER_HEADER: 'idtUpdateHeader'
};

/**
 * User types names for front
 */
const USER_TYPE = {
  IBERIA_PLUS: 'IBPLUS',
  IBERIA_ZERO: 'IBZERO',
  ON_BUSINESS: 'OB'
};
;// ./dev/js/inte-modules/ibe-modules/manage/ibe_token-utils.js




// @ts-check


/**
 * Get the access token from the cookies for Iberia and Iberia Plus users.
 * @returns { string | undefined } The cookie value or undefined if the cookie is not present.
 */
function getIbisAccessToken() {
  return window.Cookies.get(TOKEN_COOKIES_KEYS.LOGGED_TOKEN);
}

/**
 * Get the refresh token from the cookies for Iberia and Iberia Plus users.
 * @returns { string | undefined } The cookie value or undefined if the cookie is not present.
 */
function getIbisRefreshToken() {
  return window.Cookies.get(TOKEN_COOKIES_KEYS.LOGGED_REFRESH_TOKEN);
}

/**
 * Utility function to get the information as an object from a JWT token.
 * @param { string | undefined } token The token to get the information from.
 * @returns {Record<string, string> | null} The information of the token as an object.
 */
function getTokenInformation(token) {
  const base64Url = token === null || token === void 0 ? void 0 : token.split('.')[1];
  if (!base64Url) {
    return null;
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(char => "%".concat("00".concat(char.charCodeAt(0).toString(16)).slice(-2))).join(''));
  return JSON.parse(jsonPayload);
}

/**
 * Get the token information from the access token, for Iberia and Iberia Plus users.
 * @returns {Record<string, string> | null}
 */
function getAccessTokenInformation() {
  const cookieLoggedToken = getIbisAccessToken();
  return getTokenInformation(cookieLoggedToken);
}

/**
 * Get the token information from the refresh token, for Iberia and Iberia Plus users.
 * @returns {Record<string, string> | null}
 */
function getRefreshTokenInformation() {
  const cookieLoggedToken = getIbisRefreshToken();
  return getTokenInformation(cookieLoggedToken);
}

/**
 * Retrieve the identifier from the ibis token. In case of Iberia Plus the identifier
 * is the frequentFlyer, in case of Iberia Zero the identifier is the Account Identifier.
 * @returns {string | null} The frequent flyer or account identifier of the user
 */
function getIdentifierFromToken() {
  var _ref, _getAccessTokenInform, _getAccessTokenInform2, _getRefreshTokenInfor;
  return (_ref = (_getAccessTokenInform = (_getAccessTokenInform2 = getAccessTokenInformation()) === null || _getAccessTokenInform2 === void 0 ? void 0 : _getAccessTokenInform2.sub) !== null && _getAccessTokenInform !== void 0 ? _getAccessTokenInform : (_getRefreshTokenInfor = getRefreshTokenInformation()) === null || _getRefreshTokenInfor === void 0 ? void 0 : _getRefreshTokenInfor.sub) !== null && _ref !== void 0 ? _ref : null;
}
;// ./dev/js/inte-modules/ibe-modules/constants/ibe_flow_constants.js
/**
 * Partners features constants
 */
const PARTNERS = {
  STORAGE_KEYS: {
    LOCAL_STORAGE: 'ib-booking-partnerPreferences',
    SESSION_STORAGE: 'ib-booking-app.ib-booking-partnerPreferences'
  }
};

/**
 * List of flow quadrigams constants
 */
const QUADRIGAMS = {
  AVIOS_DONATION: 'AVIOSO'
};
;// ./dev/js/inte-modules/ibe-modules/general/ibe_user_header.js





// @ts-check










const getUserPartnerSelected = userId => {
  var _partnerInfo$key;
  const partnerInfo = getLocalStorageValue(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE);
  const partnerLastInfo = getSessionStorageValue(PARTNERS.STORAGE_KEYS.SESSION_STORAGE);
  const key = userId;
  return (_partnerInfo$key = partnerInfo === null || partnerInfo === void 0 ? void 0 : partnerInfo[key]) !== null && _partnerInfo$key !== void 0 ? _partnerInfo$key : partnerLastInfo;
};
/**
 * LATAM WALLET
 */
function handleLatamWalletVisibility() {
  var _membersV2$partnerLin, _membersV2$partnerLin2;
  const $noVincBlock = $('.ibe-la-no-vinc');
  // Si el JSP no imprimió la clase (porque el flag está apagado)
  if ($noVincBlock.length === 0) return;
  const membersV2 = getSessionStorageValue('retrieveMemberDetailV2');
  const isLatamWalletLogin = (_membersV2$partnerLin = membersV2 === null || membersV2 === void 0 || (_membersV2$partnerLin2 = membersV2.partnerLinkedAccounts) === null || _membersV2$partnerLin2 === void 0 || (_membersV2$partnerLin2 = _membersV2$partnerLin2.find(partner => partner.partnerId === 'LA')) === null || _membersV2$partnerLin2 === void 0 ? void 0 : _membersV2$partnerLin2.linkActive) !== null && _membersV2$partnerLin !== void 0 ? _membersV2$partnerLin : false;
  if (isLatamWalletLogin) {
    $noVincBlock.addClass('hidden').hide();
  } else {
    $noVincBlock.removeClass('hidden').show();
  }
}
const setUserPartnerSelected = (userId, selectedPartner) => {
  const selectedPartnerId = selectedPartner !== 'no' ? selectedPartner : '';
  const partnerInfo = getLocalStorageValue(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE) || {};
  const key = userId;
  const userInfo = {
    dontAskPartner: true,
    selectedPartnerId,
    timeStamp: new Date().getTime()
  };
  if (selectedPartnerId.length > 0) {
    if (userId === 'session') {
      setSessionStorageValue(PARTNERS.STORAGE_KEYS.SESSION_STORAGE, userInfo);
    } else {
      partnerInfo[key] = userInfo;
      if (partnerInfo && Object.keys(partnerInfo).length > 20) {
        let minTimeStamp = Number.MAX_SAFE_INTEGER;
        let olderKey;
        for (const auxKey in partnerInfo) {
          if (partnerInfo[auxKey].timeStamp <= minTimeStamp) {
            minTimeStamp = partnerInfo[auxKey].timeStamp;
            olderKey = auxKey;
          }
        }
        if (olderKey) {
          delete partnerInfo[olderKey];
        }
      }
      setLocalStorageValue(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE, partnerInfo);
    }
  } else {
    delete partnerInfo[key];
    removeSessionStorageValue(PARTNERS.STORAGE_KEYS.SESSION_STORAGE);
    setLocalStorageValue(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE, partnerInfo);
  }
};

/**
 * Update the menu of Iberia Plus user with the user restrictions
 * @param userMenuIbPlus User information
 */
function paintLoggedInfo(userMenuIbPlus) {
  handleLatamWalletVisibility();
  if (isLogado().userLogged && !isLogado().isSoftUser || hiddenSoftLogin == "false") {
    var _document$getElementB, _document$getElementB2, _document$getElementB3;
    const _retrieveGlobalVariab = ibe_variables(),
      localeg = _retrieveGlobalVariab.localeg,
      marketg = _retrieveGlobalVariab.marketg,
      quadrigam = _retrieveGlobalVariab.quadrigam;
    let dumboLiteral;
    $('#loggedOBUser').remove();
    const $loggedUser = $('#loggedUser');
    $('#loggedUserName', $loggedUser).html(setNameIBPlus(userMenuIbPlus.name, userMenuIbPlus.surname));
    $('.loggedUserName', $loggedUser).html("".concat(userMenuIbPlus.name, " ").concat(userMenuIbPlus.surname));
    $('#loggedUserAvios,#loggedUserAviosMobile,#loggedUserAviosNew', $loggedUser).html(setNumberFormat(userMenuIbPlus.avios, localeg, marketg));
    (_document$getElementB = document.getElementById("publicUser")) === null || _document$getElementB === void 0 || _document$getElementB.classList.add('hidden');
    (_document$getElementB2 = document.getElementById("loggedUser-Zero")) === null || _document$getElementB2 === void 0 || _document$getElementB2.classList.add('hidden');
    (_document$getElementB3 = document.getElementById("loggedUser")) === null || _document$getElementB3 === void 0 || _document$getElementB3.classList.remove('hidden');
    $('#IBP_Mobile').addClass('hidden');
    $('#IBP_Mobile_Logged').removeClass('hidden');
    $('.ibe-header-new').addClass('ibe-header-new--logged');

    /* MenuIBPlus */
    /* Class to user logged */
    $('#ibplus-form-module').removeClass('iberia-plus-connect--login').addClass('iberia-plus-connect--logged');
    $('.isLogged').removeClass('hidden');
    $('.isnotlogged').remove();
    $('.inte-goToLogin').addClass('hidden');
    // Avios Donation
    if (quadrigam === QUADRIGAMS.AVIOS_DONATION) {
      $('.inte-ONGlink').removeClass('hidden');
    }

    /* IMG card */
    let categoryName = null;
    // const $userdefaults = $('#loggedUserDefaults');
    const imgSrcCard = $('#loggedUserDefaults').attr('data-inte-imgRoot') + $('#loggedUserDefaults').attr("data-inte-".concat(userMenuIbPlus.category));
    if (userMenuIbPlus.category) {
      switch (userMenuIbPlus.category) {
        case 'INFINITAPRIME':
          categoryName = 'Iberia Club Infinita Prime';
          break;
        case 'CLASICA':
          categoryName = 'Iberia Club Clásica';
          break;
        case 'PLATINOPRIME':
          categoryName = 'Iberia Club Platino Prime';
          break;
        case 'PLATINO':
          categoryName = 'Iberia Club Platino';
          break;
        case 'ORO':
          categoryName = 'Iberia Club Oro';
          break;
        case 'PLATA':
          categoryName = 'Iberia Club Plata';
          break;
        case 'INFINITA':
          categoryName = 'Iberia Club Infinita';
          break;
        case 'KIDS':
          categoryName = 'Iberia Club Kids';
          break;
        default:
          categoryName = "Iberia Club ".concat(userMenuIbPlus.category.toLowerCase());
      }
    }
    switch (userMenuIbPlus.category) {
      case 'CLASICA':
        $('.inte-logged-clasica').removeClass('hidden');
        break;
      case 'PLATA':
        $('.inte-logged-plata').removeClass('hidden');
        break;
      case 'ORO':
        $('.inte-logged-oro').removeClass('hidden');
        break;
      case 'PLATINO':
        $('.inte-logged-platino').removeClass('hidden');
        break;
      case 'PLATINOPRIME':
        $('.inte-logged-platino').removeClass('hidden');
        break;
      case 'INFINITA':
        $('.inte-logged-infinita').removeClass('hidden');
        break;
      case 'INFINITAPRIME':
        $('.inte-logged-infinita-prime').removeClass('hidden');
        break;
      default:
        break;
    }
    const imgCard = $('<img>', {
      id: 'ibplus-card-img',
      src: imgSrcCard,
      class: 'ibe-login__img'
    });
    $('#ibplus-card-fig', $loggedUser).empty();
    $('#ibplus-card-fig', $loggedUser).append(imgCard);
    const nameCard = $('<p>', {
      id: 'loggedCardId-NewFormName',
      class: 'ibe-login__logged-title'
    });
    $('#ibplus-card-info', $loggedUser).empty();
    $('#ibplus-card-info', $loggedUser).append(nameCard);

    //FF dropdown menu with full login and permanent login
    const isSoftUser = isLogado().isSoftUser;
    const ffParagraph = document.createElement("p");
    ffParagraph.classList.add("ibe-login__logged-text");
    ffParagraph.textContent = "".concat(isSoftUser ? '' : 'IB').concat(userMenuIbPlus.id);
    const menuTitle = document.getElementById("loggedCardId-NewFormName");
    if (menuTitle) {
      menuTitle.insertAdjacentHTML('afterend', ffParagraph.outerHTML);
    }
    //

    //Confirm pass User permanent login
    if (isSoftUser && userMenuIbPlus.partnersInfo && userMenuIbPlus.partnersInfo.length > 0) {
      var _document$getElementB4;
      //$('#passConfirmSoftUser').removeClass('hidden');
      (_document$getElementB4 = document.getElementById("redirectToSale")) === null || _document$getElementB4 === void 0 || _document$getElementB4.setAttribute("href", '/integration/ibplus/login/?referralURL=' + encodeURIComponent(window.location.href));
    }
    //

    /* User data */
    const cardIdNew = $('#loggedCardId-NewFormName', $loggedUser);
    if (categoryName != null) {
      cardIdNew.html(categoryName);
    } else {
      cardIdNew.html(userMenuIbPlus.category);
    }
    $('#loggedUserName-Form,#loggedUserNameMobile').html("".concat(userMenuIbPlus.name, " ").concat(userMenuIbPlus.surname));
    const titleAux = "".concat($('#loggedUserName-Form,#loggedUserNameMobile').attr('title'), ": ").concat(userMenuIbPlus.name);
    $('#loggedUserName-Form').attr('title', titleAux);
    $('#loggedUserAvios-Form').html(setNumberFormat(userMenuIbPlus.avios, localeg, marketg));

    /* Show and hidden forms */
    $('#ibplus-loginform').addClass('hidden');
    $('#ibplus-logged').removeClass('hidden');

    /* Login form hidden */
    $('#loginFormLayout').addClass('hidden');
    if (userMenuIbPlus.partnersInfo && userMenuIbPlus.partnersInfo.length > 0) {
      var partners_link = $("#loggedUserDefaults").data("partners-link");
      var partners_html = "";
      var partner_tmpl;
      var members = "";
      userMenuIbPlus.partnersInfo.forEach(function (partner, indexPartner) {
        if (partner.partnerIdentifier === 'IBC') {
          partner_tmpl = $.parseHTML($("#partnerInfoTmplIBC").html());
        } else {
          partner_tmpl = $.parseHTML($("#partnerInfoTmpl").html());
        }
        // eslint-disable-next-line prefer-template
        if (partner.partnerProduct && partner.partnerProduct.percentDiscount && partner.partnerProduct.productTier) {
          // eslint-disable-next-line prefer-template
          let tier_discount = partner.partnerProduct.productTier;
          dumboLiteral = tier_discount + " -" + partner.partnerProduct.percentDiscount + "%";
        } else {
          let tier_discount = $(partner_tmpl).find('#partnerHeaderLink').data("get-literal");
          dumboLiteral = tier_discount.replace("{{descuento}}", partner.partnerProduct.percentDiscount);
        }
        if (partners_link.length > 0) {
          partners_link.forEach(function (link, index) {
            let key = Object.keys(link);
            if (key.length > 0) {
              var _context;
              if (includes_default()(_context = key[0]).call(_context, partner.partnerIdentifier)) {
                $(partner_tmpl).find('#partnerHeaderLink').attr("href", link[key[0]]);
              }
            }
          });
        }
        $(partner_tmpl).find("img.ibe-login__partner-info-logo-img").attr("src", "/wcs/imagenes/partners/icons/partners-logo_" + partner.partnerIdentifier + ".svg");
        $(partner_tmpl).find('label.ibe_form__radio-text').attr("for", "partner_" + partner.partnerIdentifier);
        $(partner_tmpl).find('.ibe_form__radio-input').attr("id", "partner_" + partner.partnerIdentifier);
        $(partner_tmpl).find('.ibe_form__radio-input').attr("value", "partner_" + partner.partnerIdentifier);
        $(partner_tmpl).find('.ibe-login__partners-data-title').html(partner.partnerProduct.productDescription + ": ");
        $(partner_tmpl).find('#partnerHeaderLink').attr("title", partner.partnerProduct.productDescription);
        $(partner_tmpl).find('#partnerHeaderLink').html(dumboLiteral);
        partners_html += $(partner_tmpl).prop("outerHTML");
        members += (indexPartner > 0 ? ',' : '') + partner.partnerProduct.productName;
      });
      window.datalayer_general.member = members;
      window.digital_data.Member = members;
      $("#partnersHeaderContainer").html(partners_html);
      if (userMenuIbPlus.partnersInfo.length > 1) {
        var _userMenuIbPlus$hashE;
        let partnerConfig = getUserPartnerSelected(userMenuIbPlus.idComplete.indexOf('*') === -1 ? (_userMenuIbPlus$hashE = userMenuIbPlus.hashEID) !== null && _userMenuIbPlus$hashE !== void 0 ? _userMenuIbPlus$hashE : '' : 'session');
        let selectedRadio = $("#partner_".concat(partnerConfig ? partnerConfig.selectedPartnerId : ''));
        if (selectedRadio.length > 0) {
          selectedRadio.prop('checked', true);
        } else {
          $('#partner_partner_no').prop('checked', true);
        }
        $("#tool_logged").find('.ibe_form__radio-input').off("change").on("change", function () {
          let identifier = $(this).val();
          if (identifier !== "" && identifier !== undefined) {
            identifier = identifier.split("_");
            if (identifier.length > 1) {
              var _userMenuIbPlus$hashE2;
              setUserPartnerSelected(userMenuIbPlus.idComplete.indexOf('*') === -1 ? (_userMenuIbPlus$hashE2 = userMenuIbPlus.hashEID) !== null && _userMenuIbPlus$hashE2 !== void 0 ? _userMenuIbPlus$hashE2 : '' : 'session', identifier[1]);
            }
          }
        });
      } else {
        $('.ibe-login__partners-option:has(#partner_no), .ibe-login__partners__title').addClass('hidden').closest('.ibe-login__group').addClass('u-pt-none').css({
          'border-top': 'none'
        });
        $('.ibe-login__partners-option>label').addClass('ibe-login__partners-info-no-radio');
        $('.ibe_form__radio ibe-login__partners-option:visible').addClass('u-mt-none');
      }
    } else {
      $('.ibe-login__group:has(.ibe-login__partners)').addClass('hidden').siblings('.ibe-login__group--no-border-bottom').removeClass('ibe-login__group--no-border-bottom');
    }
    listenerAvatarEvent();
    updateLoginAvatar();
  } else {
    //Anonymous Header
    $('#publicUser').removeAttr('style').removeClass('hidden');
    $('.isLogged').addClass('hidden');
  }
}
;

/**
 * Update the header and menu information for Iberia Zero users
 * @param {*} userInfo User information for the user
 */
function paintZeroLoggedInfo(userInfo) {
  if (isLogado().userLogged && !isLogado().isSoftUser || hiddenSoftLogin == "false") {
    var _document$getElementB5, _document$getElementB6, _document$getElementB7;
    $('.inte-loggedUsernameZero').html(typeof userInfo.name === 'string' && userInfo.name.length > 0 ? "".concat(userInfo.name, " ").concat(userInfo.surnames) : userInfo.email);
    (_document$getElementB5 = document.getElementById("publicUser")) === null || _document$getElementB5 === void 0 || _document$getElementB5.classList.add('hidden');
    (_document$getElementB6 = document.getElementById("loggedUser")) === null || _document$getElementB6 === void 0 || _document$getElementB6.classList.add('hidden');
    (_document$getElementB7 = document.getElementById("loggedUser-Zero")) === null || _document$getElementB7 === void 0 || _document$getElementB7.classList.remove('hidden');
    listenerAvatarEvent();
    updateLoginAvatar();
  } else {
    //Anonymous Header
    $('#publicUser').removeAttr('style').removeClass('hidden');
    $('.isLogged').addClass('hidden');
  }
}
function paintAnonymousLoggedInfo() {
  $('#publicUser').removeAttr('style').removeClass('hidden'); /* TopHeader */
  /* MenuIBPlus */
  $('.isLogged').addClass('hidden');
}

/**
 *
 * @returns {Promise<any>} Return the user information
 */
function userInfoProviderWrapper() {
  return new Promise((resolve, reject) => {
    const service = loggedService();
    service.done(() => {
      const customerData = getCustomerDataSession();
      const loggedInfo = isLogado();
      resolve({
        loggedInfo,
        customerData
      });
    });
    service.fail(() => {
      reject();
    });
  });
}

/**
 * Update WCS cached data
 */
async function updateCachedData(information) {
  if (!information) {
    removeSessionStorageValue('customerData');
    removeSessionStorageValue('retrieveMemberDetailV2');
    removeSessionStorageValue('customerDataZero');
    removeSessionStorageValue('retrieveMemberDetailZero');
    return;
  }
  const email = information.email,
    name = information.name,
    surname = information.surname,
    tierLevel = information.tierLevel,
    avios = information.avios;
  const customerData = getCustomerDataSession();
  const hashEID = (await email) && digestSHA256(email);
  const _isLogado = isLogado(),
    userType = _isLogado.userType;
  if (!customerData || !userType) return;
  customerData.email = email !== null && email !== void 0 ? email : customerData.email;
  customerData.hashEID = hashEID !== null && hashEID !== void 0 ? hashEID : customerData.hashEID;
  customerData.name = name ? toTitleCase(name) : customerData.name;
  if (userType === USER_TYPE.IBERIA_PLUS) {
    var _tierLevel$replace;
    customerData.surnames = surname ? customerData.surnames.replace(customerData.surname, surname) : customerData.surnames;
    customerData.surname = surname ? toTitleCase(surname) : customerData.surname;
    customerData.category = (_tierLevel$replace = tierLevel === null || tierLevel === void 0 ? void 0 : tierLevel.replace(' ', '')) !== null && _tierLevel$replace !== void 0 ? _tierLevel$replace : customerData.category;
    customerData.avios = avios !== null && avios !== void 0 ? avios : customerData.avios;
    setSessionStorageValue('customerData', customerData);
  } else if (userType === USER_TYPE.IBERIA_ZERO) {
    customerData.surnames = !surname || includes_default()(surname).call(surname, '@') ? customerData.surnames : toTitleCase(surname);
    setSessionStorageValue('customerDataZero', customerData);
  }
}

/**
 * Update header main function for event listeners, change header information
 * @param {Event} Event information of event
 */
function onUpdateUserHeader(_ref) {
  let detail = _ref.detail;
  updateCachedData(detail).then(() => userInfoProviderWrapper()).then(res => {
    removeAvatarEvent();
    if (res.loggedInfo.userType === USER_TYPE.IBERIA_PLUS) {
      paintLoggedInfo(res.customerData);
    } else if (res.loggedInfo.userType === USER_TYPE.IBERIA_ZERO) {
      paintZeroLoggedInfo(res.customerData);
    } else if (res.loggedInfo.userType === USER_TYPE.ON_BUSINESS) {
      // Filler to do ONB update header
    } else {
      paintAnonymousLoggedInfo();
    }
  }).catch(() => {});
}

/**
 * Attach an event listener to update the header with the user info manually when needed.
 */
function attachUpdateUserListener() {
  window.addEventListener(EVENT_NAMES.UPDATE_USER_HEADER, onUpdateUserHeader);
}

/**
 * Detach the event listener to update the header with the user info manually when needed.
 */
function detachUpdateUserListener() {
  window.removeEventListener(EVENT_NAMES.UPDATE_USER_HEADER, onUpdateUserHeader);
}
;// ./dev/js/inte-modules/ibe-modules/general/ibe_login.js
function ibe_login_slicedToArray(r, e) { return ibe_login_arrayWithHoles(r) || ibe_login_iterableToArrayLimit(r, e) || ibe_login_unsupportedIterableToArray(r, e) || ibe_login_nonIterableRest(); }
function ibe_login_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function ibe_login_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return ibe_login_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? ibe_login_arrayLikeToArray(r, a) : void 0; } }
function ibe_login_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ibe_login_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function ibe_login_arrayWithHoles(r) { if (Array.isArray(r)) return r; }



















// import { universiaIBZero, universiaIBPlusActivo } from '../universia/ibe_universia';






// eslint-disable-next-line prefer-const
let ibe_login_retrieveGlobalVariab = ibe_variables(),
  ibe_login_localeg = ibe_login_retrieveGlobalVariab.localeg,
  ibe_login_marketg = ibe_login_retrieveGlobalVariab.marketg,
  ibe_login_tokenURL = ibe_login_retrieveGlobalVariab.tokenURL,
  ibe_login_tokenUrlOB = ibe_login_retrieveGlobalVariab.tokenUrlOB,
  ibe_login_quadrigam = ibe_login_retrieveGlobalVariab.quadrigam,
  ibe_login_globalAppToken = ibe_login_retrieveGlobalVariab.globalAppToken,
  obLoginXML = ibe_login_retrieveGlobalVariab.obLoginXML,
  obLoginSAMLResp = ibe_login_retrieveGlobalVariab.obLoginSAMLResp,
  obLogoutXML = ibe_login_retrieveGlobalVariab.obLogoutXML,
  samlOBURL = ibe_login_retrieveGlobalVariab.samlOBURL,
  salesforceClientId = ibe_login_retrieveGlobalVariab.salesforceClientId,
  ibe_login_salesforceURL = ibe_login_retrieveGlobalVariab.salesforceURL,
  ibe_login_loginMicroserviceUrl = ibe_login_retrieveGlobalVariab.loginMicroserviceUrl,
  salesforceRegistroIBPlus = ibe_login_retrieveGlobalVariab.salesforceRegistroIBPlus,
  wineClubDomain = ibe_login_retrieveGlobalVariab.wineClubDomain,
  irontecDomain = ibe_login_retrieveGlobalVariab.irontecDomain,
  prestashopDomain = ibe_login_retrieveGlobalVariab.prestashopDomain,
  omnichannelDomain = ibe_login_retrieveGlobalVariab.omnichannelDomain,
  storeSessionService = ibe_login_retrieveGlobalVariab.storeSessionService,
  commercialSellingDataService = ibe_login_retrieveGlobalVariab.commercialSellingDataService,
  logoutserviceOB = ibe_login_retrieveGlobalVariab.logoutserviceOB,
  relaystateOB = ibe_login_retrieveGlobalVariab.relaystateOB,
  formOBLogin = ibe_login_retrieveGlobalVariab.formOBLogin,
  pageONBusiness = ibe_login_retrieveGlobalVariab.pageONBusiness;
const storageErrorIBPLUSkey = 'ibplus-login-error';
const storageIdentityState = 'ib-identity-stateReferral';

/**
 * @description Function to show keep session alive modal and session expired modal
 */
const keepAlive = () => {
  let sessionExpired;
  const isLogged = isLogado();
  const refreshTokenExpire = isLogged.refreshTokenExpire;

  // Get times
  const expiredTime = getDateByFormat(refreshTokenExpire, 'DD/MM/YYYY hh:mm:ss', true).getTime();
  const currentTime = new Date().getTime();
  const timeModalAlive = expiredTime - currentTime > 121000 ? 121000 : expiredTime - currentTime;
  const timeKeepAlive = expiredTime - currentTime - 121000;
  /**
   * @description Print count down with format mm:ss
   */
  function countdown() {
    let minutes;
    let seconds;
    let startDate = new Date();
    startDate = startDate.getTime();
    let timeRemaining = parseInt((expiredTime - startDate) / 1000, 10);
    if (timeRemaining >= 0) {
      minutes = parseInt(timeRemaining / 60, 10);
      timeRemaining %= 60;
      seconds = parseInt(timeRemaining, 10);
      $('.inte-modal-clock-min').text("".concat(minutes).slice(-2));
      $('.inte-modal-clock-seg').text("0".concat(seconds).slice(-2));
    }
  }
  // setTimeout using a 32 bit int, the max value allowes is 2147483647
  if (timeKeepAlive < 2147483647) {
    // Session Modals
    setTimeout(() => {
      // Show modal keep alive
      const counter = setInterval(countdown, 1000);
      setTimeout(() => {
        dFrontJs.ibe_modal.createModal('.inte-keepAliveModal');
        dFrontJs.ibe_modal.showModal('.inte-keepAliveModal');
        dFrontJs.ibe_modal.closeModal('#keepsession');
      }, 1000);

      // Show modal session expired
      sessionExpired = setTimeout(() => {
        sessionStorage.setItem('ib-inte.sessionExpired', true);
        deleteloggedcookies();
        window.location.reload();
      }, timeModalAlive);

      // Event click keep alive modal
      $('#keepsession').on('click', () => {
        const tokenUrlService = isLogged.userType === 'OB' ? ibe_login_tokenUrlOB : ibe_login_tokenURL;
        refreshToken(ibe_login_globalAppToken, tokenUrlService).done(() => {
          clearTimeout(sessionExpired);
          clearInterval(counter);
        });
      });
    }, timeKeepAlive);
  }
};
const paintLoggedInfoOB = data => {
  if (isLogado().userLogged && !isLogado().isSoftUser || hiddenSoftLogin == "false") {
    if (data) {
      // Remove logged IBPLus
      $('#loggedUser').remove();
      $('#publicUser').addClass('hidden');
      // Hide links onBusiness from menu
      $('[data-target = "#tool_onbusiness"],[data-modal-view = ".fc-dialog-onbusiness"], .inte-linkOB').addClass('hidden');
      const $obUser = $('#loggedOBUser');
      $obUser.removeClass('hidden');
      $('.inte-obUsername', $obUser).find('span').text(setNameIBPlus(data.name, data.surname));
      $('#loggedUserPoints', $obUser).text(setNumberFormat(data.puntos, ibe_login_localeg, ibe_login_marketg));
      const $userModal = $('#OBUserModal');
      $userModal.append("".concat(data.name, " ").concat(data.surname)).after("<p class='ibe-header-new__logged-txt'>".concat(data.rolCIP, "</p>"));
      $('#OBModalInfo', $obUser).removeClass('hidden').prepend("<p class='ibe-login__logged-title'>".concat(data.publicis, "</p>"));
      $('#OBrolCIP', $obUser).append(setRolCIP(data.rolCIP));
      $('#OBidentifier', $obUser).append(data.userID);
      $('#OBstatus', $obUser).append(data.NivelUsuario);
      $('#OBAmount', $obUser).append(setNumberFormat(data.puntos, ibe_login_localeg, ibe_login_marketg));
      if ($('#avioscheck').length > 0) {
        $('#avioscheck').addClass('hidden');
        $('#pointscheck').removeClass('hidden');
      }

      //Property hide clients points
      if (hiddenClientsPointsOB === "true") {
        $('#OBAmount').addClass('hidden');
        $('#sectionPointsOB').addClass('hidden');
      }
      //Property hide links points/voucher
      if (hiddenVoucherPointsLinksOB === "true" || data.rolCode === "I_PART") {
        $('.link-bono').addClass('hidden');
        $('.link-puntos').addClass('hidden');
      }
      if (data.country !== null && data.country !== "ES" && data.country !== "AD" && data.country !== "GI") {
        $("[data-asset-id=1476400808272]").remove();
      }
    }
  } else {
    //Anonymous Header
    $('#publicUser').removeAttr('style').removeClass('hidden');
    $('.isLogged').addClass('hidden');
    $('#loggedOBUser').addClass('hidden');
  }
};

/**
 * Show error modal login
 */
const showIBPLUSLoginError = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      errorKey: undefined
    },
    errorKey = _ref.errorKey;
  const loggedProperties = $('#loggedUserDefaults');
  const reportedError = errorKey !== null && errorKey !== void 0 ? errorKey : getSessionStorageValue(storageErrorIBPLUSkey);
  if (reportedError) {
    const errorMap = {
      'parental-control': loggedProperties.attr('data-inte-parentalcontrolmsg'),
      general: loggedProperties.attr('data-inte-generalerrormsg'),
      'store-session': loggedProperties.attr('data-inte-modalstoresession')
    };
    const error = errorMap[reportedError] ? errorMap[reportedError] : errorMap.general;
    showErrorModal(error);
    removeSessionStorageValue(storageErrorIBPLUSkey);
  }
};

/**
 * @description When the page load this method is executed to load the information of the user (ON Business, IBPlus, Anonymous)
 */
const dologin = function dologin() {
  const urlParams = getQuerystrParams();
  const referral = decodeURIComponent(urlParams.referralURL);
  const params = getQuerystrParams(referral);
  if (params.invitationID && params.memberID && params.type) {
    setSessionStorageValue('ib-plus-app.nomination', params);
    window.history.replaceState(null, null, "".concat(document.location.href.split('?')[0], "?referralURL=").concat(referral.split('?')[0]));
  }
  const pointsCheckifApply = () => {
    const custDt = getCustomerDataSession();
    if (custDt !== null) {
      if (custDt !== undefined && custDt.EstadoUsuario === 'logado_pyme' && $('.inte-avioscheck').length > 0) {
        $('.inte-avioscheck').addClass('hidden');
        if (hiddenCheckPayPointsOB == "false") {
          $('.inte-pointscheck').removeClass('hidden');
        }
      }
    }
  };
  const init = () => {
    const codeTracking = $('#loggedUserDefaultsCugs').attr('data-inte-cugs-codeTracking');
    const baseCodS = "".concat(ibe_login_localeg, "/").concat(ibe_login_marketg, "/");
    let userMenu = null;
    let isLogged = null;

    // const loggedServicePromise = loggedService();
    const IB_GROUP = $('#SearcherContent').attr('data-ibgroup');
    const travelAgent = getQueryParam('travelAgent');
    let userState;
    function homeQuadrigam() {
      if (ibe_login_quadrigam === "IBHMPA" || ibe_login_quadrigam === "IBHMPI") {
        if (isLogado().userLogged) {
          // Usuario logado: debe ser IBHMPI
          if (digital_data.Quadrigam === 'IBHMPA' || !digital_data.Quadrigam) {
            digital_data.Quadrigam = 'IBHMPI';
            datalayer_general.quadrigam = 'IBHMPI';
            if (datalayer_general.codigoSeguimiento) {
              datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBHMPA', 'IBHMPI');
            }
            if (digital_data.TrackingCode) {
              digital_data.TrackingCode = digital_data.TrackingCode.replace('IBHMPA', 'IBHMPI');
            }
          }
        } else {
          // Usuario NO logado: debe ser IBHMPA
          digital_data.Quadrigam = 'IBHMPA';
          datalayer_general.quadrigam = 'IBHMPA';
        }
      }
    }
    function loggedUser() {
      const loggedServicePromise = loggedService();
      const zero = document.getElementById("logadoZero");
      const nologado = document.getElementById("noLogado");
      const IBplusActivo = document.getElementById("logadoPlusActivo");
      const IBplusNoActivo = document.getElementById("logadoPlusSinPlan");
      const userZero = document.getElementById("IBZERORegister");
      const userUpgrade = document.getElementById("UPGRADEIBplus");
      loggedServicePromise.done(() => {
        // CUGs
        userMenu = getCustomerDataSession();
        isLogged = isLogado();
        // Attach listener to update header on demand
        detachUpdateUserListener();
        attachUpdateUserListener();
        dFrontJs.ibe_loading.close('body');
        if (userMenu.EstadoUsuario === 'logado_pyme') {
          datalayer_general.segmento = userMenu.segmento;
          datalayer_general.userID = userMenu.userID;
          datalayer_general.EstadoUsuario = 'logado_pyme';
          datalayer_general.NivelUsuario = userMenu.NivelUsuario;
          datalayer_general.rolCIP = userMenu.rolCIP;
          datalayer_general.codigoSeguimiento = "".concat(ibe_login_localeg, "/").concat(ibe_login_marketg, "/").concat(ibe_login_quadrigam);
          datalayer_general.avios = userMenu.puntos;
          digital_data.UserSegment = userMenu.segmento;
          digital_data.UserID = userMenu.userID;
          digital_data.UserStatus = userMenu.EstadoUsuario;
          digital_data.UserLevel = userMenu.NivelUsuario;
          digital_data.RolCIP = userMenu.rolCIP;
          digital_data.TrackingCode = "".concat(ibe_login_localeg, "/").concat(ibe_login_marketg, "/").concat(ibe_login_quadrigam);
          digital_data.Avios = userMenu.puntos;
          paintLoggedInfoOB(userMenu);
          // To show on business image, it was not being triggered when opened.
          $('#tool_loggedOB').on('shown.bs.collapse', () => {
            dFrontJs.app.emitInView();
            $('#tool_loggedOB').off('shown.bs.collapse');
          });
          // Hide link redemption search engine
          $('.inte-login-redemption').addClass('hidden');
          homeQuadrigam();
          // Show points check
          //updateDatalayer('view'); Remove for 2 view
          //updateDigitalData('view');
          pointsCheckifApply();
          keepAlive();
          removeSessionStorageValue('urlUpgradeRedirect');
        } else if (userMenu != null && isLogado().userType === 'IBPLUS') {
          // Function Simulador Avios class
          if (userUpgrade != null) {
            userZero.classList.add('hidden');
            userUpgrade.classList.add('hidden');
          }
          //
          removeSessionStorageValue('urlUpgradeRedirect');
          // Function Universia
          // universiaIBPlusActivo(userMenu);
          if (nologado != null) {
            if (userMenu.partnersInfo.length > 0) {
              if (userMenu.partnersInfo[0].partnerIdentifier === 'SUN') {
                zero.classList.add("hidden");
                nologado.classList.add("hidden");
                IBplusActivo.classList.remove("hidden");
              } else {
                IBplusNoActivo.classList.remove("hidden");
                zero.classList.add("hidden");
                nologado.classList.add("hidden");
              }
            } else {
              IBplusNoActivo.classList.remove("hidden");
              zero.classList.add("hidden");
              nologado.classList.add("hidden");
            }
          }
          //
          if (userMenu.termsAndConditions) {
            var _getIdentifierFromTok, _userMenu$hashEID, _userMenu$hashEID2;
            userState = isLogged.isSoftUser ? 'logado_ff_soft' : 'logado_ff_hard';
            if (ibe_login_quadrigam === 'IBBLUT' || ibe_login_quadrigam === 'IBBLUS') {
              window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/");
            }
            // NOT CUGs
            if ($('.ibe-cub').find('.ibe-search-flights--cug').length <= 0) {
              datalayer_general.segmento = userMenu.segment;
              digital_data.UserSegment = userMenu.segment;
            }
            if (digital_data.Quadrigam === 'IBHMPA') {
              datalayer_general.quadrigam = 'IBHMPI';
              datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBHMPA', 'IBHMPI');
              digital_data.Quadrigam = 'IBHMPI';
              digital_data.TrackingCode = digital_data.TrackingCode.replace('IBHMPA', 'IBHMPI');
            }
            const userIdentifier = (_getIdentifierFromTok = getIdentifierFromToken()) !== null && _getIdentifierFromTok !== void 0 ? _getIdentifierFromTok : '';
            datalayer_general.EstadoUsuario = userState;
            if ('INFINITAPRIME' == userMenu.category) {
              datalayer_general.NivelUsuario = 'INFINITA PRIME';
            } else if ('IBERIASINGULAR' == userMenu.category) {
              datalayer_general.NivelUsuario = 'IBERIA SINGULAR';
            } else {
              datalayer_general.NivelUsuario = userMenu.category;
            }
            datalayer_general.userID = userIdentifier;
            datalayer_general.avios = userMenu.avios;
            digital_data.UserID = userIdentifier;
            digital_data.UserStatus = userState;
            if ('INFINITAPRIME' == userMenu.category) {
              digital_data.UserLevel = 'INFINITA PRIME';
            } else if ('PLATINOPRIME' == userMenu.category) {
              digital_data.UserLevel = 'PLATINO PRIME';
            } else if ('IBERIASINGULAR' == userMenu.category) {
              digital_data.UserLevel = 'IBERIA SINGULAR';
            } else {
              digital_data.UserLevel = userMenu.category;
            }
            digital_data.Avios = userMenu.avios;
            paintLoggedInfo(userMenu);
            $('[data-url-private]').each(function eah() {
              if ($(this).attr('data-url-private').length) {
                $(this).attr('href', $(this).attr('data-url-private'));
              }
              $(this).removeAttr('data-url-private');
            });
            // IBPLUS don't need keep alive becasuse refresh dont expire
            //keepAlive();

            const isPrivateLogin = $('[data-login-private]').length > 0 && !$('[data-login-private]').hasClass('hidden') && $('[data-private-content]').length > 0;
            if (isPrivateLogin) {
              const quadrigamLogin = $('[data-login-private]').attr('data-login-private');
              datalayer_general.quadrigam = quadrigamLogin;
              datalayer_general.codigoSeguimiento = "".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/").concat(quadrigamLogin);
              digital_data.Quadrigam = quadrigamLogin;
              digital_data.TrackingCode = "".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/").concat(quadrigamLogin);
            }
            datalayer_general.hashEID = (_userMenu$hashEID = userMenu.hashEID) !== null && _userMenu$hashEID !== void 0 ? _userMenu$hashEID : '';
            digital_data.HashEID = (_userMenu$hashEID2 = userMenu.hashEID) !== null && _userMenu$hashEID2 !== void 0 ? _userMenu$hashEID2 : '';
            homeQuadrigam();
            //updateDatalayer('view');
            //updateDigitalData('view');
            if (isPrivateLogin) {
              $('[data-login-private]').addClass('hidden');
              $('[data-private-content]').removeAttr('style');
              datalayer_general.quadrigam = ibe_login_quadrigam;
              datalayer_general.codigoSeguimiento = "".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/").concat(ibe_login_quadrigam);
              digital_data.Quadrigam = ibe_login_quadrigam;
              digital_data.TrackingCode = "".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/").concat(ibe_login_quadrigam);
            }
            $(document.body).trigger('loginIBPLUSCompleted');
            /** Send event to load angular application * */
            $(document.body).trigger('loginEventWCS');
            // if (quadrigam === 'IBLBTT') {
            //   window.showCombineAction !== undefined && showCombineAction();
            // }
            dFrontJs.ibe_loading.close('body');
          } else if (ibe_login_quadrigam !== 'CGPIBP' && ibe_login_quadrigam !== 'PRIVAC') {
            const showModalTermsConditions = () => {
              dFrontJs.ibe_validate.init();
              dFrontJs.ibe_modal.createModal('.inte-errormodal-terms');
              dFrontJs.ibe_modal.showModal('.inte-errormodal-terms');
              $('#checkAcceptTerms').on('click', () => {
                if (dFrontJs.ibe_validate.validateForm('#formCheck')) {
                  const serviceSuccess = () => {
                    removeSessionStorageValue('customerData');
                    removeSessionStorageValue('retrieveMemberDetailV2');
                    $('.inte-errormodal-terms').dialog().dialog('close');
                    init();
                    dFrontJs.ibe_loading.close('.inte-loading-modal');
                  };
                  const serviceFailure = () => {
                    $('.inte-termsCondition-error').removeClass('hidden');
                    dFrontJs.ibe_loading.close('.inte-loading-modal');
                    $('#continueLogout').on('click', () => {
                      $('.inte-errormodal-terms').dialog().dialog('close');
                      logoutIBPlusService();
                    });
                  };
                  const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');
                  const headers = {
                    Authorization: "Bearer ".concat(accessTokenTxt),
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                  };
                  const params = {
                    termsAndConditions: {
                      acceptedDate: new Date().toISOString().substring(0, 10),
                      version: '1.1'
                    }
                  };
                  dFrontJs.ibe_loading.open('.inte-loading-modal');
                  const memberDetailsV2 = getSessionStorageValue('retrieveMemberDetailV2');
                  const urlService = $('.inte-errormodal-terms').attr('inte-update-member-service') + memberDetailsV2.memberPersonalDetails.identifier;
                  callService(urlService, headers, JSON.stringify(params), 'PUT').then(serviceSuccess, serviceFailure);
                }
              });
            };
            if (!($('.inte-errormodal-terms').length > 0)) {
              $.ajax({
                method: 'GET',
                url: '/cs/Satellite',
                data: {
                  pagename: 'IB_SE/CacheControl6h/BrowserCache3600/TermsConditionErrorModal',
                  market: ibe_login_marketg,
                  locale: ibe_login_localeg,
                  d: 'Desktop'
                }
              }).done(data => {
                $('body').append(data);
                showModalTermsConditions();
              });
            } else {
              $('.inte-termsCondition-error').addClass('hidden');
              dFrontJs.ibe_modal.showModal('.inte-errormodal-terms');
            }
          }
        } else if (isLogado().userType === 'IBZERO') {
          var _getIdentifierFromTok2, _userMenu$hashEID3, _userMenu$hashEID4;
          // Function Simulador Avios class
          if (userZero != null) {
            userZero.classList.add('hidden');
            userUpgrade.classList.remove('hidden');
            //Metricas
            document.querySelector('.ibe-avios-simulator-banner__background').addEventListener('click', function () {
              const eventBannerZero = {
                eventName: 'interaccion',
                eventCategory: 'simulador avios',
                eventAction: 'registro ib+',
                eventLabel: ' botón visible usuario iberia zero'
              };
              if (typeof window.DigitalChange !== 'undefined') {
                window.DigitalChange('interaction', eventBannerZero);
              }
              if (typeof window.dataLayer !== 'undefined') {
                window.dataLayer.push(eventBannerZero, {
                  event: 'interaction'
                });
              }
            });
          }
          //EJEMPLO
          $('.isLogged').addClass('hidden');
          $('.isLogged-IBZERO').removeClass('hidden');
          $('.isnotlogged ').addClass('hidden');
          //universiaIBZero();
          if (nologado != null) {
            zero.classList.remove("hidden");
            nologado.classList.add("hidden");
          }
          userState = isLogged.isSoftUser ? 'logado_ib_soft' : 'logado_ib_hard';
          const userIdentifier = (_getIdentifierFromTok2 = getIdentifierFromToken()) !== null && _getIdentifierFromTok2 !== void 0 ? _getIdentifierFromTok2 : '';
          datalayer_general.userID = userIdentifier;
          digital_data.UserID = userIdentifier;
          datalayer_general.EstadoUsuario = userState;
          digital_data.UserStatus = userState;
          datalayer_general.hashEID = (_userMenu$hashEID3 = userMenu.hashEID) !== null && _userMenu$hashEID3 !== void 0 ? _userMenu$hashEID3 : '';
          digital_data.HashEID = (_userMenu$hashEID4 = userMenu.hashEID) !== null && _userMenu$hashEID4 !== void 0 ? _userMenu$hashEID4 : '';
          if (digital_data.Quadrigam === 'IBHMPA') {
            datalayer_general.quadrigam = 'IBHMPI';
            datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBHMPA', 'IBHMPI');
            digital_data.Quadrigam = 'IBHMPI';
            digital_data.TrackingCode = digital_data.TrackingCode.replace('IBHMPA', 'IBHMPI');
          }
          // Lógica para mostrar los  enlaces, llamar a la función que pinta la cabecera etc
          $(document.body).trigger('loginIBPLUSCompleted');
          /** Send event to load angular application * */
          $(document.body).trigger('loginEventWCS');

          // set session - url redirect upgrade
          setUrlUpgrade();
          paintZeroLoggedInfo(userMenu);
          homeQuadrigam();
          //updateDatalayer('view');
          //updateDigitalData('view');
        } else {
          removeSessionStorageValue('urlUpgradeRedirect');
          datalayer_general.EstadoUsuario = 'no_logado';
          digital_data.UserStatus = 'no_logado';
          $('#publicUser').removeAttr('style').removeClass('hidden'); /* TopHeader */
          /* MenuIBPlus */
          $('.isLogged').addClass('hidden');
          // Show modal session expired
          if (sessionStorage.getItem('ib-inte.sessionExpired')) {
            $(window).on('load', () => {
              showErrorModal($('#loggedUserDefaults').attr('data-inte-modalbody2session'), {
                btnclose: true,
                btnaccept: true,
                btncancel: false,
                closereload: false,
                bodyNoClose: true
              }, $('#loggedUserDefaults').attr('data-inte-modaltitlesession'), $('#loggedUserDefaults').attr('data-inte-modalbody1session'));
            });
            sessionStorage.removeItem('ib-inte.sessionExpired');
          }
        }
      });
      loggedServicePromise.fail(() => {
        dFrontJs.ibe_loading.close('body');
        datalayer_general.EstadoUsuario = 'no_logado';
        digital_data.UserStatus = 'no_logado';
        $('#publicUser').removeAttr('style').removeClass('hidden'); /* TopHeader */
        /* MenuIBPlus */
        $('.isLogged').addClass('hidden');
        // Show modal session expired
        if (sessionStorage.getItem('ib-inte.sessionExpired')) {
          $(window).on('load', () => {
            showErrorModal($('#loggedUserDefaults').attr('data-inte-modalbody2session'), {
              btnclose: true,
              btnaccept: true,
              btncancel: false,
              closereload: false,
              bodyNoClose: true
            }, $('#loggedUserDefaults').attr('data-inte-modaltitlesession'), $('#loggedUserDefaults').attr('data-inte-modalbody1session'));
          });
          sessionStorage.removeItem('ib-inte.sessionExpired');
        }
      });
      loggedServicePromise.always(() => {
        ibe_segmentation();
      });
      homeQuadrigam();
    }
    if ($('.ibe-cub').find('.ibe-search-flights--cug').length > 0) {
      if (travelAgent !== false) {
        datalayer_general.segmento = IB_GROUP;
        datalayer_general.usuarioColectivo = "agencias_".concat(travelAgent);
        datalayer_general.codigoSeguimiento = baseCodS + ibe_login_quadrigam;
        digital_data.UserSegment = IB_GROUP;
        digital_data.UserCUG = "agencias_".concat(travelAgent);
        digital_data.TrackingCode = baseCodS + ibe_login_quadrigam;
      } else {
        datalayer_general.segmento = 'Colectivo';
        datalayer_general.usuarioColectivo = codeTracking;
        datalayer_general.codigoSeguimiento = "".concat(baseCodS, "Colectivos/").concat(codeTracking);
        digital_data.UserSegment = 'Colectivo';
        digital_data.UserCUG = codeTracking;
        digital_data.TrackingCode = "".concat(baseCodS, "Colectivos/").concat(codeTracking);
      }
      //updateDatalayer('view');
      //updateDigitalData('view');
    }
    if (Cookies.get('IBERIACOM_SSO_ONB_KEEPSESSION') !== undefined && !isLogado().userLogged) {
      loginOBService();
    } else {
      // Remove SSO_ONB_KEEPSESSION at any case
      Cookies.remove('IBERIACOM_SSO_ONB_KEEPSESSION');
      // Display error if needed
      showIBPLUSLoginError();
      loggedUser();
    }
  };
  return {
    init,
    pointsCheckifApply
  };
}();
/** Set Login Info
 * Promise returns true or false indicatig if the params are set or not
*/
const setOnBusinesLoginParams = () => {
  const deferred = $.Deferred();
  if (ibe_login_tokenUrlOB !== 'null') {
    if (typeof obLogInfo === 'undefined') {
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/Presentation/Login/GetOnBusinessLogInfo',
          hostname: window.location.hostname,
          d: ''
        }
      }).done(data => {
        $('head').append(data);
        deferred.resolve(true);
      }).fail(() => {
        $('.inte-linkOB').removeClass('inte-linkOB');
        deferred.reject(false);
      });
    } else {
      deferred.resolve(true); // is actually set
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise();
};
const callServiceXML = (serviceUrl, authorizationToken, params, language) => {
  const headers = {
    Authorization: "Bearer ".concat(authorizationToken),
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': language
  };
  return $.ajax({
    url: serviceUrl,
    xhrFields: {
      withCredentials: true
    },
    type: 'POST',
    headers,
    data: JSON.stringify(params)
  });
};
const generateXML = (serviceUrl, authorizationToken, params) => callServiceXML(serviceUrl, authorizationToken, params);
/* Logout OnBusiness */
const logoutOBService = curr => {
  const currAux = curr || 0;
  setOnBusinesLoginParams().done(res => {
    if (res) {
      if (currAux <= common.MAX_ATTEMPS) {
        const isLogged = isLogado();
        const accessToken = isLogged.userLogged ? isLogged.accessToken : null;
        if (isLogged.userLogged) {
          const params = window.obLogInfo.issuer ? {
            issuer: window.obLogInfo.issuer
          } : '';
          const XMLPromise = generateXML(obLogoutXML, accessToken, params);
          let form;
          let inputXML;
          let inputRelayState;
          let inputLanguage;
          XMLPromise.done(data => {
            removeSessionStorageValue('customerDataOB');
            removeSessionStorageValue('accessTokenOB');
            form = $(document.createElement('form'));
            $(form).attr('action', samlOBURL);
            $(form).attr('method', 'POST');
            inputXML = $('<input>').attr('type', 'hidden').attr('name', 'SAMLRequest').val(data.xml);
            inputRelayState = $('<input>').attr('type', 'hidden').attr('name', 'RelayState').val("/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg, "/"));
            inputLanguage = $('<input>').attr('type', 'hidden').attr('name', 'language').val(ibe_login_localeg);
            $(form).append($(inputXML));
            $(form).append($(inputRelayState));
            $(form).append($(inputLanguage));
            form.appendTo(document.body);
            $(form).submit();
          });
          XMLPromise.fail(error => {
            if (error.status === 401) {
              refreshToken(ibe_login_globalAppToken, ibe_login_tokenUrlOB).done(() => {
                logoutOBService(currAux + 1);
              });
            }
          });
        } else {
          // Press button but not logged in
          deleteloggedcookies();
          removeSessionStorageValue('customerDataOB');
          removeSessionStorageValue('accessTokenOB');
          if (pageONBusiness) {
            window.location.href = pageONBusiness;
          } else {
            window.location.reload();
          }
        }
      }
    }
  }).fail(() => {
    // eslint-disable-next-line no-console
    console.error("On Business - Couldn't get logout params");
  });
};
const loginOBError = () => {
  dFrontJs.ibe_loading.close('body');
  var isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    setTimeout(function () {
      $("[data-target='#tool_onbusiness']").attr('data-toggle', 'collapse');
      if (!$("#tool_onbusiness").hasClass("in")) {
        $("[data-target='#tool_onbusiness']").trigger("click");
      }
      $("[data-target='#tool_onbusiness']").removeAttr('data-toggle');
      $("[data-ibis-error]").removeClass("hidden");
      $("[data-ibis-error]").closest(".ibe_form__group").addClass("ibe_form__group--error");
    }, 500);
  }
};
const loginOBService = (aux, error) => {
  const currAux = aux || "";
  let anonToken = getSessionStorageValue('anonymousTokenOB');
  var dataOb = {};
  if (activateOldLoginOB != "true") {
    dataOb = {
      "username": $(formOBLogin).closest(".ibe_form").find(".user-login-OB").val(),
      "password": $(formOBLogin).closest(".ibe_form").find(".passw-login-OB").val()
    };
  }
  dataOb.logoutURL = undefined;
  function loginAction() {
    let navMarket;
    let navLanguage;
    const cookieSplit = Cookies.get('IBERIACOM_PERSONALIZATION') ? Cookies.get('IBERIACOM_PERSONALIZATION').split('|') : [];
    if (cookieSplit.length >= 3) {
      if (cookieSplit[1] && cookieSplit[1].length > 0 && cookieSplit[2] && cookieSplit[2].length > 0) {
        // eslint-disable-next-line prefer-destructuring
        navMarket = cookieSplit[1];
        // eslint-disable-next-line prefer-destructuring
        navLanguage = cookieSplit[2];
      } else {
        navMarket = 'ES';
        navLanguage = 'es';
      }
    } else {
      navMarket = 'ES';
      navLanguage = 'es';
    }
    const homeURL = "/".concat(navMarket.toLowerCase(), "/").concat(navLanguage.toLowerCase(), "/");
    let samlServiceURL = obLoginSAMLResp;
    if (activateOldLoginOB == "true") {
      samlServiceURL = obLoginXML;
    } else {
      dataOb = {
        "username": $(formOBLogin).closest(".ibe_form").find(".user-login-OB").val(),
        "password": $(formOBLogin).closest(".ibe_form").find(".passw-login-OB").val()
      };
    }
    callServiceXML(samlServiceURL, anonToken, dataOb).done((data, textStatus, jqXHR) => {
      deleteloggedcookies();
      if (activateOldLoginOB == "true") {
        const xml = data.xml;
        const $ibgroup = $('#SearcherContent').attr('data-ibgroup');
        const form = $('<form>', {
          id: 'oBForm',
          method: 'POST',
          action: samlOBURL
        });
        form.append($('<input>', {
          name: 'SAMLRequest',
          class: 'hidden',
          value: xml
        })).append($('<input>', {
          name: 'language',
          class: 'hidden',
          value: navLanguage.toLowerCase()
        }));
        if ($ibgroup !== undefined && $ibgroup.length > 0 || window.location.pathname !== '/integration/obsso/login/' && Cookies.get('IBERIACOM_SSO_ONB_KEEPSESSION') !== undefined && !isLogado().userLogged) {
          form.append($('<input>', {
            name: 'RelayState',
            class: 'hidden',
            value: window.location.pathname
          }));
        } else {
          form.append($('<input>', {
            name: 'RelayState',
            class: 'hidden',
            value: homeURL
          }));
        }
        $('head').append(form);
        $('#oBForm').trigger('submit');
      } else {
        let now = Date.now();
        let date_access_to = new Date(now + data.expires_in * 1000);
        date_access_to = date_access_to.getDate() + "/" + (date_access_to.getMonth() + 1) + "/" + date_access_to.getFullYear() + " " + date_access_to.getHours() + ":" + date_access_to.getMinutes() + ":" + date_access_to.getSeconds();
        let date_refresh_to = new Date(now + data.refresh_expires_in * 1000);
        date_refresh_to = date_refresh_to.getDate() + "/" + (date_refresh_to.getMonth() + 1) + "/" + date_refresh_to.getFullYear() + " " + date_refresh_to.getHours() + ":" + date_refresh_to.getMinutes() + ":" + date_refresh_to.getSeconds();
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS=' + data.access_token + ';path=/;samesite=strict;max-age=' + data.expires_in * 6;
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS_TO=' + date_access_to + ';path=/;samesite=strict;max-age=' + data.expires_in * 6;
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH=' + data.refresh_token + ';path=/;samesite=strict;max-age=' + data.refresh_expires_in * 6;
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH_TO=' + date_refresh_to + ';path=/;samesite=strict;max-age=' + data.refresh_expires_in * 6;

        //location.reload();
        location.href = location.protocol + "//" + location.hostname + urlRedirectOB;

        /*onBusinessTmpl(dataOb.username, data.xml);
        if(jqXHR.status != 200){
          loginOBError();
        }*/
      }
      Cookies.remove('IBERIACOM_SSO_ONB_KEEPSESSION');
    }).fail(errorfl => {
      loginOBError();
      loginOBService(currAux + 1, errorfl.status);
    });
  }
  if (activateOldLoginOB == "true" || dFrontJs.ibe_validate.validateLoginFormOB(dataOb)) {
    var isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      $('.ibe-header-new__menu-button').trigger('click');
    }
    setOnBusinesLoginParams().done(res => {
      if (res) {
        if (currAux <= common.MAX_ATTEMPS) {
          dataOb = {
            issuer: window.obLogInfo.issuer,
            consumerUrlService: window.obLogInfo.loginURL
          };
          dFrontJs.ibe_loading.open('body');
          if (!anonToken || error === 401) {
            generateAnonymousToken(ibe_login_tokenUrlOB, ibe_login_globalAppToken).done(tokenResponse => {
              setSessionStorageValue('anonymousTokenOB', tokenResponse.access_token);
              anonToken = tokenResponse.access_token;
              loginAction();
            });
          } else {
            loginAction();
          }
        } else {
          dFrontJs.ibe_loading.close('body');
        }
      } else {
        dFrontJs.ibe_loading.close('body');
      }
    }).fail(() => {
      // eslint-disable-next-line no-console
      console.error("On Business - Couldn't get login params");
    });
  }
};
const onBusinessTmpl = (user, saml) => {
  $.ajax({
    method: 'POST',
    url: '/integration/obsso/login/',
    data: {
      user: user,
      SAMLResponse: saml
    }
  }).done(data => {
    try {
      data = JSON.parse(data);
      if (data != undefined && data.IBERIACOM_SSO_ONB_ACCESS != undefined) {
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS=' + data.IBERIACOM_SSO_ONB_ACCESS + ';path=/;samesite=strict;max-age=' + data.IBERIACOM_SSO_ONB_ACCESS_MAX;
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS_TO=' + data.IBERIACOM_SSO_ONB_ACCESS_TO + ';path=/;samesite=strict;max-age=' + data.IBERIACOM_SSO_ONB_ACCESS_MAX;
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH=' + data.IBERIACOM_SSO_ONB_REFRESH + ';path=/;samesite=strict;max-age=' + data.IBERIACOM_SSO_ONB_REFRESH_MAX;
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH_TO=' + data.IBERIACOM_SSO_ONB_REFRESH_TO + ';path=/;samesite=strict;max-age=' + data.IBERIACOM_SSO_ONB_REFRESH_MAX;

        //location.reload();
        location.href = location.protocol + "//" + location.hostname + urlRedirectOB;
      } else {
        loginOBError();
      }
    } catch (e) {
      loginOBError();
    }
  }).fail(errorfl => {
    loginOBError();
  });
};
/*LogOutOBKeycloak */
const logoutOBKeycloak = () => {
  const isLogged = isLogado();
  if (isLogged.refreshTokenTxt) {
    callTokenService(logoutserviceOB, ibe_login_globalAppToken, $.param({
      refresh_token: isLogged.refreshTokenTxt
    })).then((data, textStatus, codeStatus) => {
      if (codeStatus.status === 204) {
        console.log("204");
        deleteloggedcookies();
        window.location.href = relaystateOB;
      } else {
        window.location.href = relaystateOB;
      }
    }).catch(() => {
      window.location.href = relaystateOB;
    });
  }
};
/**
 * Validates the referralURL to be the same domain (or subdomain) of the current page to avoid
 * phishing attacks
 * @param { string } url
 */
function hasReferralUrlSameDomain(url) {
  /** If no url it redirects to same domain */
  if (!url) return true;
  /** If relative path it redirects to same domain */
  if (url.startsWith('/')) return true;
  const completeUrl = !url.startsWith('https') ? "https://".concat(url) : url;
  const actualHost = window.location.host;
  try {
    const urlObj = new (url_default())(completeUrl);
    const host = urlObj.host;
    return host === actualHost || host.endsWith(".".concat(actualHost.replace('www.', '')));
  } catch {
    return false;
  }
}

/**
 * Validates the referralURL to be the same domain (or subdomain) of the current page or any of the whitelisted partners to avoid
 * phising attacks
 * @param { string } url
 */
function hasWhitelistedPartnersDomain(url) {
  const _retrieveGlobalVariab2 = ibe_variables(),
    wineClubDomain = _retrieveGlobalVariab2.wineClubDomain,
    irontecDomain = _retrieveGlobalVariab2.irontecDomain,
    prestashopDomain = _retrieveGlobalVariab2.prestashopDomain,
    omnichannelDomain = _retrieveGlobalVariab2.omnichannelDomain;
  const partnersDomains = [wineClubDomain, irontecDomain, prestashopDomain, omnichannelDomain];
  const sameDomain = hasReferralUrlSameDomain(url);
  if (sameDomain) return sameDomain;
  try {
    const _URL2 = new (url_default())(url),
      host = _URL2.host;
    return includes_default()(partnersDomains).call(partnersDomains, host);
  } catch {
    return false;
  }
}

/**
*  Function calls to salesforce to get information about token expiration and calls to
*   keycloack to get token
* reject: User weren't logged in
*/
const loginIBPlusService = () => {
  const deferred = $.Deferred();
  const urlParams = getQuerystrParams();
  const urlTokenSalesforce = "".concat(ibe_login_loginMicroserviceUrl, "rs/v1/token/salesforce-token");
  const urlLoginSalesforce = "".concat(ibe_login_salesforceURL, "authorize/expid_1").concat(ibe_login_marketg.toUpperCase()).concat(ibe_login_localeg.toLowerCase());
  let urlRegisterSalesforce = "".concat(salesforceRegistroIBPlus);
  const clientIberiaSalesforce = salesforceClientId;
  // let userAux;
  // let passwordAux;
  if (typeof urlParams.language === 'string' && urlParams.language.length > 0) {
    urlRegisterSalesforce = urlRegisterSalesforce + '?language=' + "".concat(urlParams.language);
  }
  if (typeof urlParams.code === 'string' && urlParams.code.length > 0) {
    getAnonymousTokenPromise().then(() => {
      const params = {
        code: decodeURIComponent(urlParams.code),
        redirect_uri: window.location.origin + window.location.pathname,
        grant_type: 'authorization_code',
        format: 'json'
      };
      const headers = {
        'Content-type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: "Bearer ".concat(getSessionStorageValue('anonymousToken'))
      };
      return callService(urlTokenSalesforce, headers, params, 'POST');
    }).then(data => {
      // Set salesforce and keycloack cookies
      deleteloggedcookies();
      $.ajax({
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl0s/Integration/logOut'
        }
      });
      Promise.all([setCookiesSalesforce(data), setTokenKeycloack(null, data.access_token)]).then(resp => {
        const respTokenKeycloack = resp[1];
        const isLogged = isLogado();
        if (respTokenKeycloack.access_token) {
          const token = JSON.parse(atob(respTokenKeycloack.access_token.split('.')[1]));
          if (token !== undefined && token.realm_access !== undefined && token.realm_access.roles.length > 0) {
            if (token.realm_access.roles.filter(el => {
              return el === 'ROLE_IBERIA_ZERO';
            }).length > 0) {
              document.cookie = "IBERIACOM_SSO_TYPE=IBZERO;path=/;expires=".concat(new Date(isLogged.refreshTokenSFExpire).toGMTString(), ";secure=true;");
            } else {
              document.cookie = "IBERIACOM_SSO_TYPE=IBPLUS;path=/;expires=".concat(new Date(isLogged.refreshTokenSFExpire).toGMTString(), ";secure=true;");
            }
          }
        }
        deferred.resolve();
      }).catch(() => {
        deferred.reject();
      });
    }).catch(() => {
      deferred.reject();
    });

    /**
     * Check if the user is going to external partner, in that case we redirect to login salesforce
     */
  } else if (typeof urlParams.externalpartner === 'string' && urlParams.externalpartner.length > 0) {
    if (urlParams.referralURL && !hasWhitelistedPartnersDomain(decodeURIComponent(urlParams.referralURL))) {
      window.location.href = '/';
    } else {
      setSessionStorageValue(storageIdentityState, {
        externalObj: {
          externalPartner: urlParams.externalpartner,
          sessionId: urlParams.sessionId,
          referralURL: urlParams.referralURL ? decodeURIComponent(urlParams.referralURL) : undefined
        }
      });
      if (urlParams.externalpartner === 'ib_register_wineclub') {
        window.location.href = "".concat(urlRegisterSalesforce);
      } else if (urlParams.externalpartner === 'ibplustore') {
        window.location.href = "".concat(urlLoginSalesforce, "01?client_id=").concat(clientIberiaSalesforce, "&redirect_uri=").concat(window.location.origin + window.location.pathname, "&prompt=login&response_type=code");
      } else {
        window.location.href = "".concat(urlLoginSalesforce, "?client_id=").concat(clientIberiaSalesforce, "&redirect_uri=").concat(window.location.origin + window.location.pathname, "&prompt=login&response_type=code");
      }
    }
  } else {
    const referralURL = typeof urlParams.referralURL === 'string' ? decodeURIComponent(urlParams.referralURL) : '';
    const sameDomain = hasReferralUrlSameDomain(referralURL);
    if (!sameDomain) {
      window.location.href = '/';
    } else {
      setSessionStorageValue(storageIdentityState, {
        referralURL
      });
      window.location.href = "".concat(urlLoginSalesforce, "?client_id=").concat(clientIberiaSalesforce, "&redirect_uri=").concat(window.location.origin + window.location.pathname, "&prompt=login&response_type=code");
    }
  }
  return deferred.promise();
};
/**
* Functions call to external-ancillaries sso service
* @param {String} code Code of external partner. This code must be part of service url
* @returns {promise}
*/
const loginExternalPartnerService = code => {
  const deferred = $.Deferred();
  let url = $('[data-loginext-serviceurl]').data('loginext-serviceurl');
  function callServiceloginExternal(round) {
    const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');
    const headers = {
      Authorization: '',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    const roundAux = round || 0;
    if (roundAux < common.MAX_ATTEMPS) {
      headers.Authorization = "Bearer ".concat(accessTokenTxt);
      callService(url, headers, undefined, 'GET').done(data => {
        deferred.resolve(data);
      }).fail(error => {
        if (error.status === 401) {
          refreshToken(ibe_login_globalAppToken, ibe_login_tokenURL).always(() => {
            callServiceloginExternal(roundAux + 1);
          });
        } else {
          deferred.reject();
        }
      });
    } else {
      deferred.reject();
    }
  }
  if (typeof code === 'string' && code.length > 0 && url && url.length > 0) {
    url = "".concat(url + code, "/url/");
    callServiceloginExternal();
  } else {
    deferred.reject();
  }
  return deferred.promise();
};

// const dInteJs = () => {
window.dInteJs = {};
const retrieveStateInfo = state => {
  const stStored = getSessionStorageValue(storageIdentityState);
  removeSessionStorageValue(storageIdentityState);
  let st = state;
  st !== null && st !== void 0 ? st : st = '/';
  if (stStored && stStored.externalObj) {
    return stStored.externalObj;
  } else if (stStored && stStored.referralURL) {
    return stStored;
  } else {
    return {
      referralURL: decodeURIComponent(st)
    };
  }
};

/**
 * Functions call to external service store session
 */
function sendHotelCarsInfo() {
  const deferred = $.Deferred();

  /**
   * Functions call to external service CommercialSellingData to get Markets' Commercial Selling Data List
   * @param {Number} round Iteration number of access to CommercialSellingData service
   * @returns {promise} resolve: response with the currency code associated with the current market
   * reject: if something has gone wrong it returns EUR by default
   */
  const getCurrency = round => {
    const roundAux = round || 0;
    const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: "Bearer ".concat(accessTokenTxt)
    };
    if (roundAux <= common.MAX_ATTEMPS) {
      callService(commercialSellingDataService, headers, undefined, 'GET').done(data => {
        if (data.length > 0) {
          const object = data.find(element => element.market.code === "".concat(ibe_login_marketg));
          if (object !== undefined && object.length > 0) {
            deferred.resolve(object.currency.code);
          } else {
            deferred.reject('EUR');
          }
        }
      }).fail(error => {
        if (error.status === 401) {
          refreshToken(ibe_login_globalAppToken, ibe_login_tokenURL).always(() => {
            getCurrency(roundAux + 1);
          });
        } else {
          deferred.reject('EUR');
        }
      });
    } else {
      deferred.reject('EUR');
    }
    return deferred.promise();
  };

  /**
   * Function that redirect user to third party
   * @param {String} resp Response from StoreSession service with the session identifier
   */
  const serviceSuccess = resp => {
    const customerData = getCustomerDataSession();
    const currencyServiceProm = getCurrency();
    if (getSessionStorageValue('retrieveMemberDetailV2')) {
      const memberDetailSessionV2 = getSessionStorageValue('retrieveMemberDetailV2');
      const membershipID = memberDetailSessionV2.memberPersonalDetails.identifier;
      currencyServiceProm.always(data => {
        const form = $('<form>', {
          method: 'POST',
          action: $('#loggedUserDefaults').attr('data-switchfly-url'),
          class: 'hidden'
        });
        form.append($('<input>', {
          name: 'securityToken',
          value: resp.sessionIdentifier
        })).append($('<input>', {
          name: 'membershipID',
          value: membershipID
        })).append($('<input>', {
          name: 'currencyCode',
          value: data
        })).append($('<input>', {
          name: 'refererURL',
          value: "".concat(window.location.hostname, "/").concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/")
        })).append($('<input>', {
          name: 'language',
          value: customerData.preferredLanguage
        })).append($('<input>', {
          name: 'journeyType',
          value: ''
        })).append($('<input>', {
          name: 'channelFeeFlag',
          value: 'N'
        })).append($('<input>', {
          name: 'flagAmendmentFee',
          value: 'N'
        })).append($('<input>', {
          name: 'cancellationFeeFlag',
          value: 'Y'
        }));
        $('body').append(form);
        form.submit();
      });
    } else {
      setSessionStorageValue(storageErrorIBPLUSkey, 'store-session');
      window.location.href = '/';
    }
  };

  /**
   * Function that shows a modal with a error message
   */
  const serviceFailure = () => {
    setSessionStorageValue(storageErrorIBPLUSkey, 'store-session');
    window.location.href = '/';
    /* showErrorModal($('#loggedUserDefaults').attr('data-inte-modalstoresession'), {
      btnclose: true,
      btnaccept: true,
      btncancel: false,
      closereload: false,
      bodyNoClose: true,
    });*/
    // dFrontJs.ibe_loading.close('body');
  };
  const refreshTokenTxt = Cookies.get('IBERIACOM_SSO_REFRESH');
  const params = {
    refreshToken: "".concat(refreshTokenTxt),
    channelIdentifier: "".concat(ibe_login_globalAppToken),
    partnerIdentifier: 'SWF'
  };
  callServiceSSO(storeSessionService, params).then(serviceSuccess, serviceFailure);
}

/**
 * When Iberia Plus login is from an external Omnichannel partner, redirect to the partner with the required information.
 */
function onIberiaPlusOmnichannelPartnerLogin(_ref2) {
  var _membersV2$memberPers, _completeAddress$addr, _completeAddress$addr2, _completeAddress$addr3;
  let referralURL = _ref2.referralURL;
  const _isLogado = isLogado(),
    userType = _isLogado.userType;
  const membersV2 = getSessionStorageValue('retrieveMemberDetailV2');
  const customerData = getCustomerDataSession();
  if (!membersV2 || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    setSessionStorageValue(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }
  const scheme = membersV2.memberPersonalDetails.schemes.find(scheme => {
    const recognition = scheme.recognitionLevel.recognitionLevelIdentifier;
    return recognition !== 'IBERIA SINGULAR';
  });
  const completeAddress = (_membersV2$memberPers = membersV2.memberPersonalDetails.postalAddresses) === null || _membersV2$memberPers === void 0 ? void 0 : _membersV2$memberPers.find(address => {
    return address.type === 'Home';
  });
  const userInformation = {
    generalInfo: {
      userType: userType,
      // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: membersV2.memberPersonalDetails.identifier,
      // Only iberia plus 14 digits, null otherwise 
      identifier: null,
      // For Iberia Zero User, null otherwise (NEW) 
      category: scheme === null || scheme === void 0 ? void 0 : scheme.recognitionLevel.recognitionLevelIdentifier,
      // Only iberia plus, null otherwise 
      avios: customerData.avios // Only iberia plus, null otherwise 
    },
    personalInfo: {
      name: membersV2.memberPersonalDetails.person.personName.firstName,
      // Can be null or string 
      surname1: membersV2.memberPersonalDetails.person.personName.familyName,
      // Can be null or string 
      surname2: membersV2.memberPersonalDetails.person.personName.secondfamilyName || null,
      // Can be null or string 
      contactPhone: null,
      // Can be null or string 
      contactEmail: membersV2.memberPersonalDetails.person.emailAddress.email,
      // String 
      residence: {
        address: (completeAddress === null || completeAddress === void 0 || (_completeAddress$addr = completeAddress.addressLines) === null || _completeAddress$addr === void 0 ? void 0 : _completeAddress$addr[0]) || null,
        // Can be null or string 
        streetNumber: (completeAddress === null || completeAddress === void 0 || (_completeAddress$addr2 = completeAddress.addressLines) === null || _completeAddress$addr2 === void 0 ? void 0 : _completeAddress$addr2[1]) || null,
        // Can be null or string (NEW) 
        apartment: (completeAddress === null || completeAddress === void 0 || (_completeAddress$addr3 = completeAddress.addressLines) === null || _completeAddress$addr3 === void 0 ? void 0 : _completeAddress$addr3[2]) || null,
        // Can be null or string (NEW) 
        town: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.city) || null,
        // Can be null or string 
        country: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.country) || null,
        // Can be null or string 
        state: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.state) || null,
        // Can be null or string,
        postalCode: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.postCode) || null // Can be null or string, (NEW) 
      }
    }
  };
  const createInput = _ref3 => {
    let name = _ref3.name,
      value = _ref3.value;
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    return input;
  };
  const form = document.createElement('form');
  form.style.display = 'none';
  const _isLogado2 = isLogado(),
    accessToken = _isLogado2.accessToken,
    refreshTokenTxt = _isLogado2.refreshTokenTxt;
  form.append(createInput({
    name: 'accessToken',
    value: accessToken
  }));
  form.append(createInput({
    name: 'refreshToken',
    value: refreshTokenTxt
  }));
  form.append(createInput({
    name: 'userInformation',
    value: window.btoa(JSON.stringify(userInformation))
  }));
  form.method = 'POST';
  form.action = referralURL;
  document.body.append(form);
  form.submit();
}

/**
 * When Iberia Plus login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onIberiaPlusWineClubPartnerLogin(_ref4) {
  var _membersV2$memberPers2, _completeAddress$addr4, _completeAddress$addr5, _completeAddress$addr6;
  let referralURL = _ref4.referralURL;
  const _isLogado3 = isLogado(),
    userType = _isLogado3.userType;
  const membersV2 = getSessionStorageValue('retrieveMemberDetailV2');
  const customerData = getCustomerDataSession();
  if (!membersV2 || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    setSessionStorageValue(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }
  const scheme = membersV2.memberPersonalDetails.schemes.find(scheme => {
    const recognition = scheme.recognitionLevel.recognitionLevelIdentifier;
    return recognition !== 'IBERIA SINGULAR';
  });
  const completeAddress = (_membersV2$memberPers2 = membersV2.memberPersonalDetails.postalAddresses) === null || _membersV2$memberPers2 === void 0 ? void 0 : _membersV2$memberPers2.find(address => {
    return address.type === 'Home';
  });
  const userInformation = {
    generalInfo: {
      userType: userType,
      // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: membersV2.memberPersonalDetails.identifier,
      // Only iberia plus 14 digits, null otherwise 
      identifier: null,
      // For Iberia Zero User, null otherwise (NEW) 
      category: scheme === null || scheme === void 0 ? void 0 : scheme.recognitionLevel.recognitionLevelIdentifier,
      // Only iberia plus, null otherwise 
      avios: customerData.avios // Only iberia plus, null otherwise 
    },
    personalInfo: {
      name: membersV2.memberPersonalDetails.person.personName.firstName,
      // Can be null or string 
      surname1: membersV2.memberPersonalDetails.person.personName.familyName,
      // Can be null or string 
      surname2: membersV2.memberPersonalDetails.person.personName.secondfamilyName || null,
      // Can be null or string 
      contactPhone: null,
      // Can be null or string 
      contactEmail: membersV2.memberPersonalDetails.person.emailAddress.email,
      // String 
      residence: {
        address: (completeAddress === null || completeAddress === void 0 || (_completeAddress$addr4 = completeAddress.addressLines) === null || _completeAddress$addr4 === void 0 ? void 0 : _completeAddress$addr4[0]) || null,
        // Can be null or string 
        streetNumber: (completeAddress === null || completeAddress === void 0 || (_completeAddress$addr5 = completeAddress.addressLines) === null || _completeAddress$addr5 === void 0 ? void 0 : _completeAddress$addr5[1]) || null,
        // Can be null or string (NEW) 
        apartment: (completeAddress === null || completeAddress === void 0 || (_completeAddress$addr6 = completeAddress.addressLines) === null || _completeAddress$addr6 === void 0 ? void 0 : _completeAddress$addr6[2]) || null,
        // Can be null or string (NEW) 
        town: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.city) || null,
        // Can be null or string 
        country: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.country) || null,
        // Can be null or string 
        state: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.state) || null,
        // Can be null or string,
        postalCode: (completeAddress === null || completeAddress === void 0 ? void 0 : completeAddress.postCode) || null // Can be null or string, (NEW) 
      }
    }
  };
  onWineClubPartnerLogin({
    referralURL,
    userInformation
  });
}

/**
 * When Iberia Plus login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onIberiaZeroOmniChannelPartnerLogin(_ref5) {
  var _context, _contactDetails$addre, _contactDetails$addre2, _contactDetails$addre3;
  let referralURL = _ref5.referralURL;
  const _isLogado4 = isLogado(),
    userType = _isLogado4.userType;
  const members = getSessionStorageValue('retrieveMemberDetailZero');
  const customerData = getCustomerDataSession();
  if (!members || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    setSessionStorageValue(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }
  const _members = ibe_login_slicedToArray(members, 2),
    personalData = _members[0],
    contactDetails = _members[1];
  const zeroIdentifier = getIdentifierFromToken();
  const userInformation = {
    generalInfo: {
      userType: userType,
      // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: null,
      identifier: zeroIdentifier,
      // For Iberia Zero User, null otherwise (NEW) 
      category: null,
      avios: null
    },
    personalInfo: {
      name: personalData.name || null,
      // Can be null or string 
      surname1: !personalData.lastName || includes_default()(_context = personalData.lastName).call(_context, '@') ? null : personalData.lastName,
      // Can be null or string 
      surname2: null,
      // Can be null or string 
      contactPhone: contactDetails.phone.number || null,
      // Can be null or string 
      contactEmail: contactDetails.email,
      // String 
      residence: {
        address: ((_contactDetails$addre = contactDetails.addresss) === null || _contactDetails$addre === void 0 ? void 0 : _contactDetails$addre.street) || null,
        // Can be null or string 
        streetNumber: ((_contactDetails$addre2 = contactDetails.addresss) === null || _contactDetails$addre2 === void 0 ? void 0 : _contactDetails$addre2.streetNumber) || null,
        // Can be null or string (NEW) 
        apartment: ((_contactDetails$addre3 = contactDetails.addresss) === null || _contactDetails$addre3 === void 0 ? void 0 : _contactDetails$addre3.apartment) || null,
        // Can be null or string (NEW) 
        town: contactDetails.city || null,
        // Can be null or string 
        country: contactDetails.countryCode || null,
        // Can be null or string
        state: contactDetails.province || null,
        // Can be null or string,
        postalCode: contactDetails.postalCode || null // Can be null or string, (NEW) 
      }
    }
  };
  const createInput = _ref6 => {
    let name = _ref6.name,
      value = _ref6.value;
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    return input;
  };
  const form = document.createElement('form');
  form.style.display = 'none';
  const _isLogado5 = isLogado(),
    accessToken = _isLogado5.accessToken,
    refreshTokenTxt = _isLogado5.refreshTokenTxt;
  form.append(createInput({
    name: 'accessToken',
    value: accessToken
  }));
  form.append(createInput({
    name: 'refreshToken',
    value: refreshTokenTxt
  }));
  form.append(createInput({
    name: 'userInformation',
    value: window.btoa(JSON.stringify(userInformation))
  }));
  form.method = 'POST';
  form.action = referralURL;
  document.body.append(form);
  form.submit();
}

/**
 * When Iberia Plus login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onIberiaZeroWineClubPartnerLogin(_ref7) {
  var _context2, _contactDetails$addre4, _contactDetails$addre5, _contactDetails$addre6;
  let referralURL = _ref7.referralURL;
  const _isLogado6 = isLogado(),
    userType = _isLogado6.userType;
  const members = getSessionStorageValue('retrieveMemberDetailZero');
  const customerData = getCustomerDataSession();
  if (!members || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    setSessionStorageValue(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }
  const _members2 = ibe_login_slicedToArray(members, 2),
    personalData = _members2[0],
    contactDetails = _members2[1];
  const zeroIdentifier = getIdentifierFromToken();
  const userInformation = {
    generalInfo: {
      userType: userType,
      // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: null,
      identifier: zeroIdentifier,
      // For Iberia Zero User, null otherwise (NEW) 
      category: null,
      avios: null
    },
    personalInfo: {
      name: personalData.name || null,
      // Can be null or string 
      surname1: !personalData.lastName || includes_default()(_context2 = personalData.lastName).call(_context2, '@') ? null : personalData.lastName,
      // Can be null or string 
      surname2: null,
      // Can be null or string 
      contactPhone: contactDetails.phone.number || null,
      // Can be null or string 
      contactEmail: contactDetails.email,
      // String 
      residence: {
        address: ((_contactDetails$addre4 = contactDetails.addresss) === null || _contactDetails$addre4 === void 0 ? void 0 : _contactDetails$addre4.street) || null,
        // Can be null or string 
        streetNumber: ((_contactDetails$addre5 = contactDetails.addresss) === null || _contactDetails$addre5 === void 0 ? void 0 : _contactDetails$addre5.streetNumber) || null,
        // Can be null or string (NEW) 
        apartment: ((_contactDetails$addre6 = contactDetails.addresss) === null || _contactDetails$addre6 === void 0 ? void 0 : _contactDetails$addre6.apartment) || null,
        // Can be null or string (NEW) 
        town: contactDetails.city || null,
        // Can be null or string 
        country: contactDetails.countryCode || null,
        // Can be null or string
        state: contactDetails.province || null,
        // Can be null or string,
        postalCode: contactDetails.postalCode || null // Can be null or string, (NEW) 
      }
    }
  };
  onWineClubPartnerLogin({
    referralURL,
    userInformation
  });
}

/**
 * When login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onWineClubPartnerLogin(_ref8) {
  let referralURL = _ref8.referralURL,
    userInformation = _ref8.userInformation;
  const createInput = _ref9 => {
    let name = _ref9.name,
      value = _ref9.value;
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    return input;
  };
  const form = document.createElement('form');
  form.style.display = 'none';
  const _isLogado7 = isLogado(),
    accessToken = _isLogado7.accessToken,
    refreshTokenTxt = _isLogado7.refreshTokenTxt;
  form.append(createInput({
    name: 'accessToken',
    value: accessToken
  }));
  form.append(createInput({
    name: 'refreshToken',
    value: refreshTokenTxt
  }));
  form.append(createInput({
    name: 'userInformation',
    value: window.btoa(JSON.stringify(userInformation))
  }));
  form.method = 'POST';
  form.action = referralURL;
  document.body.append(form);
  form.submit();
}

/**
 * Main method to do login in Iberia after salesforce sucessful login
 * @return {*}
 */
function loginIBPlus() {
  const deferred = $.Deferred();
  const isLogged = isLogado();
  const urlParams = getQuerystrParams();
  const loginSuccess = () => {
    let form;
    let externalURL;
    const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
    const refreshCookie = Cookies.get('IBERIACOM_SSO_REFRESH');
    // Tracking login success
    const eventData = {
      eventName: 'interaccion',
      eventCategory: 'intento de login',
      eventAction: 'clic',
      eventLabel: 'login ok'
    };
    if (typeof window.DigitalChange !== 'undefined') {
      window.DigitalChange('interaction', eventData);
    }
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push(eventData, {
        event: 'interaction'
      });
    }
    getMemberData(accessCookie, "".concat(ibe_login_localeg, "-").concat(ibe_login_marketg), isLogado().userType).done(() => {
      var _paramsSF$register, _paramsSF$market, _paramsSF$language;
      const customerData = getCustomerDataSession();
      const state = retrieveStateInfo(urlParams.state);
      const expDate = new Date(decodeURIComponent(isLogged.accessTokenExpire));
      const jsonSessionlogged = {
        'first_name': customerData.name,
        'last_name': customerData.surname
      };
      const jsonStringSession = JSON.stringify(jsonSessionlogged);
      const splitted = window.location.hostname.split('.');
      Cookies.set("IBERIACOM_SSO_SESION", btoa(jsonStringSession), {
        domain: ".".concat(splitted.slice(splitted.length - 2).join('.')),
        path: "/",
        expires: expDate,
        sameSite: "strict"
      });

      ////redireccion RRSS login params SalesForce
      const stateSF = state.referralURL;
      let paramsSF = {};
      try {
        const url = new (url_default())(stateSF);
        paramsSF = from_entries_default()(new (url_search_params_default())(url.search));
      } catch {
        paramsSF = from_entries_default()(new (url_search_params_default())(stateSF));
      }
      const rrss = paramsSF['rrss'];
      /** @type {'1' | '2' | '3' | '4' | null } */
      const typerrss = paramsSF['typerrss'];
      const registerByTyperrss = {
        '1': 'zero',
        '2': 'plus'
      };
      /** @type {'plus' | 'zero' | null } */
      const registerParamState = (_paramsSF$register = paramsSF['register']) !== null && _paramsSF$register !== void 0 ? _paramsSF$register : registerByTyperrss[typerrss];

      //locale-market del registro
      ibe_login_marketg = (_paramsSF$market = paramsSF['market']) !== null && _paramsSF$market !== void 0 ? _paramsSF$market : ibe_login_marketg;
      ibe_login_localeg = (_paramsSF$language = paramsSF['language']) !== null && _paramsSF$language !== void 0 ? _paramsSF$language : ibe_login_localeg;
      const universia = paramsSF['partner'];
      const invitationCode = paramsSF['invitationCode'];
      const upgradeKO = paramsSF['UpgradeKO'];
      const upgradeOK = paramsSF['UpgradeOK'];
      const registroClub = paramsSF['registroClub'];
      let referral = state.referralURL;
      if (rrss != null && rrss === 'true') {
        var _localStorage$getItem;
        referral = (_localStorage$getItem = localStorage.getItem('returnURL')) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : state.referralURL;
      }

      //leemos y borramos session returnURL
      localStorage.removeItem('returnURL');
      if (isLogado().userType === 'IBPLUS') {
        if (customerData.parentalControl) {
          if (state) {
            const params = getQuerystrParams(referral);
            if (Object.keys(params).length === 3 && params.invitationID && params.memberID && params.type) {
              setSessionStorageValue('ib-plus-app.nomination', params);
              const referralURLClean = decodeURIComponent(referral).split('?')[0];
              window.location = referralURLClean;
            } else if (state.externalPartner && state.externalPartner.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              const externalPartner = state.externalPartner;
              switch (externalPartner) {
                case 'ibplustore':
                  externalURL = $('[data-ibplustore-url]').data('ibplustore-url');
                  // Send token to iberiaplustore
                  form = $('<form>', {
                    method: 'POST',
                    action: "".concat(externalURL, "auth/ib"),
                    class: 'hidden'
                  });
                  form.append($('<input>', {
                    name: 'tokenIB',
                    value: accessCookie
                  }));
                  deleteloggedcookies();
                  $('body').append(form);
                  form.submit();
                  break;
                case 'ib_omnichannel_eva':
                  onIberiaPlusOmnichannelPartnerLogin({
                    referralURL: referral
                  });
                  break;
                case 'ib_dig_wineclub':
                  onIberiaPlusWineClubPartnerLogin({
                    referralURL: referral
                  });
                  break;
                case 'ib_register_wineclub':
                  onIberiaPlusWineClubPartnerLogin({
                    referralURL: referral
                  });
                  break;
                case 'aviosandmoney':
                  // dFrontJs.ibe_loading.open('body');
                  sendHotelCarsInfo();
                  break;
                case 'pgt':
                  externalURL = $('[data-ptg-url]').data('ptg-url');
                  const prmPTG = $.param({
                    partner: 'ib',
                    sessionId: state.sessionId
                  });
                  form = $('<form>', {
                    method: 'POST',
                    action: "".concat(externalURL, "?").concat(prmPTG),
                    class: 'hidden'
                  });
                  form.append($('<input>', {
                    name: 'accessToken',
                    value: accessCookie
                  })).append($('<input>', {
                    name: 'refreshToken',
                    value: refreshCookie
                  }));
                  $('body').append(form);
                  form.submit();
                  break;
                case 'eci':
                  externalURL = $('[data-eci-url]').data('eci-url');
                  // Send token to iberiaplustore
                  form = $('<form>', {
                    method: 'POST',
                    action: "".concat(externalURL),
                    class: 'hidden'
                  });
                  form.append($('<input>', {
                    name: 'access_token',
                    value: accessCookie
                  }));
                  form.append($('<input>', {
                    name: 'refresh_token',
                    value: refreshCookie
                  }));
                  form.append($('<input>', {
                    name: 'externalpartner',
                    value: 'ibp'
                  }));
                  deleteloggedcookies();
                  $('body').append(form);
                  form.submit();
                  break;
                default:
                  // Login externo
                  loginExternalPartnerService(externalPartner).done(datas => {
                    if (datas.params && datas.params.length > 0) {
                      form = $('<form>', {
                        method: 'POST',
                        action: datas.url,
                        class: 'hidden'
                      });
                      form.append($('<input>', {
                        name: 'market',
                        value: ibe_login_marketg.toUpperCase()
                      })).append($('<input>', {
                        name: 'language',
                        value: ibe_login_localeg.toLowerCase()
                      })).append($('<input>', {
                        name: datas.params[0].paramName,
                        value: datas.params[0].paramValue
                      }));
                      /* if (typeof (urlParams.referralURL) === 'string' && urlParams.referralURL.length > 0) {
                        urlParams.referralURL = decodeURIComponent(urlParams.referralURL);
                        form.append($('<input>', { name: 'referralURL', value: urlParams.referralURL }));
                      } */
                    }
                  }).fail(() => {
                    // dFrontJs.ibe_loading.close('body');
                    // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
                    // showErrorModal(errormsg);
                    generateLoginEvent(false);
                    logoutIBPlusService();
                    setSessionStorageValue(storageErrorIBPLUSkey, 'general');
                    window.location.href = '/';
                    deferred.reject();
                    // formbtn.prop('disabled',false);
                  });
                  break;
              }
            } else {
              // Redireccionamiento registro SF landing Universia
              if (universia === 'LSUN') {
                //Redirecciona a la landing de la Iberia con partner de Universia
                window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/?partner=ZSUN");
              }
              // Redireccionamiento inicio de sesion para la invitacion
              else if (invitationCode) {
                window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/mi-iberia/#/IBMIBP?tab=your-benefits&tier-nomination=upgrade");
              } else if (registroClub) {
                window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/mi-iberia/#/IBMIBP?registratedUser=true");
              }
              //redireccion SalesForce RRSS IB PLUS
              else if (rrss != null && typerrss != null && rrss === 'true') {
                if (typerrss == 0) {
                  window.location.href = referral;
                } else {
                  const params = new (url_search_params_default())({
                    rrss: rrss,
                    typerrss: typerrss
                  });
                  if (registerParamState) params.set('register', registerParamState);
                  const target = '?' + params.toString();
                  redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBPHOM', 'Page', target);
                }
              }
              //SF NO RRSS
              else if (rrss != null && typerrss != null && rrss === 'false') {
                if (typerrss == 0) {
                  const params = new (url_search_params_default())();
                  if (upgradeOK) {
                    window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/mi-iberia/#/profile");
                  } else if (registerParamState) params.set('register', registerParamState);
                  alert('normal referral');
                  const target = params.size > 0 ? '?' + params.toString() : '';
                  redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBPHOM', 'Page', target);
                }
              } else if (referral && referral.length > 0) {
                generateLoginEvent(true);
                if (window.top === window.self) {
                  window.location.href = referral;
                }
              } else {
                generateLoginEvent(true);
                if (window.top === window.self) {
                  window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/");
                }
              }
            }
          }
          //fin state
          else {
            generateLoginEvent(true);
            if (window.top === window.self) {
              window.location.href = '/';
            }
          }
        }
        //error parental control
        else {
          logoutIBPlusService().always(() => {
            // dFrontJs.ibe_loading.close('body');
            // errormsg = loggedProperties.attr('data-inte-parentalcontrolmsg');
            // showErrorModal(errormsg);
            generateLoginEvent(false, {
              type: 'error',
              payload: 'parental-control'
            });
            if (window.top === window.self) {
              setSessionStorageValue(storageErrorIBPLUSkey, 'parental-control');
              window.location.href = '/';
            }
            deferred.reject();
          });
        }
      } //FIN IBPLUS
      else if (isLogado().userType === 'IBZERO') {
        var _state$externalPartne;
        if ((state === null || state === void 0 || (_state$externalPartne = state.externalPartner) === null || _state$externalPartne === void 0 ? void 0 : _state$externalPartne.length) > 0) {
          const externalPartner = state.externalPartner;
          switch (externalPartner) {
            case 'ib_omnichannel_eva':
              onIberiaZeroOmniChannelPartnerLogin({
                referralURL: referral
              });
              break;
            case 'ib_dig_wineclub':
              onIberiaZeroWineClubPartnerLogin({
                referralURL: referral
              });
              break;
            case 'ib_register_wineclub':
              onIberiaZeroWineClubPartnerLogin({
                referralURL: referral
              });
              break;
          }
          //redireccion SalesForce RRSS IB ZERO
        } else {
          if (rrss != null && typerrss != null) {
            /* Normal login */
            if (typerrss == 0 && !registerParamState) {
              window.location.href = referral;
              /* Iberia Zero Registration Form */
            } else if (typerrss == 0 && registerParamState) {
              if (upgradeKO) {
                window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/mi-iberia/#/IBMIBP?registerPopUp=true");
              }
              const params = new (url_search_params_default())({
                register: registerParamState
              });
              const target = '?' + params.toString();
              redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBPHOM', 'Page', target);
              /* Iberia Zero Registration Social Network */
            } else {
              const params = new (url_search_params_default())({
                rrss: rrss,
                typerrss: typerrss
              });
              if (registerParamState) params.set('register', registerParamState);
              const target = '?' + params.toString();
              redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBPHOM', 'Page', target);
            }
          } else if (referral && referral.length > 0) {
            generateLoginEvent(true);
            if (window.top === window.self) {
              window.location.href = referral;
            }
          } else {
            generateLoginEvent(true);
            if (window.top === window.self) {
              window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/");
            }
          }
        }
      } else {
        generateLoginEvent(true);
        if (referral && referral.length > 0) {
          if (window.top === window.self) {
            window.location.href = referral;
          }
        } else {
          generateLoginEvent(true);
          if (window.top === window.self) {
            window.location.href = "/".concat(ibe_login_marketg.toLowerCase(), "/").concat(ibe_login_localeg.toLowerCase(), "/");
          }
        }
      }
    }).fail(() => {
      // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
      // showErrorModal(errormsg);
      logoutIBPlusService().always(() => {
        // dFrontJs.ibe_loading.close('body');
        removeSessionStorageValue(storageIdentityState);
        generateLoginEvent(false);
        if (window.top === window.self) {
          setSessionStorageValue(storageErrorIBPLUSkey, 'general');
          window.location.href = '/';
        }
        deferred.reject();
      });
    });
  };
  const loginFailure = err => {
    let error = err;
    error = error || {
      status: 0,
      responseJSON: null
    };
    const errorcode = error.responseJSON ? error.responseJSON.error : undefined;
    removeSessionStorageValue(storageIdentityState);
    // Tracking login fail
    const eventData = {
      eventName: 'interaccion',
      eventCategory: 'intento de login',
      eventAction: 'clic',
      eventLabel: 'login ko'
    };
    if (typeof window.DigitalChange !== 'undefined') {
      window.DigitalChange('interaction', eventData);
    }
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push(eventData, {
        event: 'interaction'
      });
    }
    // Error cases
    // Suposing that comes from service
    if (errorcode === 'invalid_grant') {
      // errormsg = (error.responseJSON.loggedBy !== 'email') ? loggedProperties.attr('data-inte-invalidcredentialsmsg') : loggedProperties.attr('data-inte-invalidcredentialsemail');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      if (window.top === window.self) {
        setSessionStorageValue(storageErrorIBPLUSkey, 'general');
        window.location.href = '/';
      }
    } else if (errorcode === 'invalid_grant_mail') {
      // errormsg = loggedProperties.attr('data-inte-repeatedmailmsg');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      if (window.top === window.self) {
        setSessionStorageValue(storageErrorIBPLUSkey, 'general');
        window.location.href = '/';
      }
      // Temporal and permanent blocked users
    } else if (errorcode === 'invalid_grant_BT') {
      redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBBLUT');
    } else if (errorcode === 'invalid_grant_BP') {
      redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBBLUS');
      // User logged with an expired pin
    } else if (errorcode === 'invalid_grant_PE') {
      setSessionStorageValue('ib-plus-app.passwordExpired', true);
      redirectByQuadrigam(ibe_login_marketg, ibe_login_localeg, 'IBOLPS');
    } else {
      // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      deleteloggedcookies();
      if (window.top === window.self) {
        setSessionStorageValue(storageErrorIBPLUSkey, 'general');
        window.location.href = '/';
      }
    }
    deferred.reject();
  };
  if (!isLogged.userLogged || isLogged.userLogged && isLogged.isSoftUser) {
    loginIBPlusService().then(loginSuccess, loginFailure);
  } else if (isLogged.userLogged) {
    if (urlParams.externalpartner && urlParams.externalpartner.length > 0) {
      logoutIBPlusService().always(() => {
        loginIBPlus();
      });
    } else if (urlParams.referralURL && urlParams.referralURL.length > 0) {
      window.location.href = decodeURIComponent(urlParams.referralURL);
    } else {
      window.location.href = '/';
    }
    deferred.resolve();
  } else {
    window.location.href = '/';
    deferred.reject();
  }
  return deferred.promise();
}
;
/**
* Logout function
* @returns Promise: Resolve if call logout service was ok
* Reject if call logout service was ko
*/
window.dInteJs.logoutIBPlus = () => logoutIBPlusService();

// OnBuisness login function
const onBusinessLogin = () => {
  //Modal Onbusiness
  //Desktop
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    async: false,
    data: {
      pagename: 'IB_SE/Onbusiness/Login',
      market: $('#mercado').val(),
      locale: $('#idioma').val(),
      mobile: 'false',
      activateob: $("[data-onbusiness='onbusiness']").data('activateob'),
      listid: $("[data-onbusiness='onbusiness']").data('listid'),
      d: ''
    },
    success(data) {
      $("[data-onbusiness='onbusiness']").html(data);
    }
  });
  //Mobile
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    async: false,
    data: {
      pagename: 'IB_SE/Onbusiness/Login',
      market: $('#mercado').val(),
      locale: $('#idioma').val(),
      mobile: 'true',
      activateob: $("[data-onbusiness='onbusiness']").data('activateob'),
      listid: $("[data-onbusiness='onbusiness']").data('listid'),
      d: ''
    },
    success(data) {
      $("#dialog-onbusiness-modal").html(data);
      if ($('.modal-dialog').find('.ibe-accordion')) {
        dFrontJs.ibe_bootstrap_collapse.modalAccordion($('.modal-dialog'));
      }
      dFrontJs.ibe_modal.closeModal();
    }
  });
  // OnBuisness login function
  const onBusinessLoginAction = click => {
    if (ibe_login_tokenUrlOB !== 'null') {
      // OB Compatibility
      click.preventDefault();
      formOBLogin = click.currentTarget;
      loginOBService();
    }
  };
  const logoutOnbusinessListener = e => {
    // LogOut On Business. When success it reload the current page.
    e.preventDefault();
    deleteloggedcookies();
    if (pageONBusiness) {
      window.location.href = pageONBusiness;
    } else {
      window.location.reload();
    }
    /*$.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl0s/Integration/logOut',
      },
      success() {
        // OB Compatibility IBPLUS
        if (obLogoutXML !== 'null') {
          logoutOBService();
        } else {
          const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 18 Dec 1990 12:00:00 UTC; path=/`;
          };
          deleteCookie('IBERIACOM_SSO_CIP');
          window.location.reload();
        }
      },
    });*/
  };
  // Login OnBusiness
  $('.inte-linkOB').on('click', onBusinessLoginAction);
  $('.logOutOB').on('click', logoutOnbusinessListener);
};
/* fill Logged Data
This function fills all imputs that contains the
attribute data-lgfill. This attribute must have a value that
matchs to an object's key of IBPlus / On Business user's info
*/
const fillLoggedData = () => {
  const $inputs = $('[data-lgfill]');
  const data = getCustomerDataSession();
  let $el = '';
  const form = $inputs.closest('form');
  if (data && $inputs.length > 0) {
    $inputs.each(function eah() {
      $el = $(this);
      $el.val(data[$el.data('lgfill')]);
      $el.focus();
      $el.removeAttr('data-lgfill');
      if ($el.hasClass('inte-lgfillblock')) {
        $el.attr('disabled', 'disabled');
        $el.addClass('ibe_form__group--disabled');
      }
    });
    $(form.find(':input').get(0)).focus();
  }
};
window.updateWCSHeaderAvios = () => {
  removeSessionStorageValue('retrieveMemberDetailV2');
  const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
  getMemberData(accessCookie, "".concat(ibe_login_localeg, "-").concat(ibe_login_marketg), 'IBPLUS').then(() => {
    const customerData = getCustomerDataSession();
    const $loggedUser = $('#loggedUser');
    $('#loggedUserAvios,#loggedUserAviosMobile,#loggedUserAviosNew', $loggedUser).html(setNumberFormat(customerData.avios, ibe_login_localeg, ibe_login_marketg));
    $('#loggedUserAvios-Form').html(setNumberFormat(userMenuIbPlus.avios, ibe_login_localeg, ibe_login_marketg));
  }).catch(() => {});
};

// set session storage - url redirect upgrade
const setUrlUpgrade = () => {
  const url = window.location.href;
  if (!isPrivateAreaApp()) {
    setSessionStorageValue('urlUpgradeRedirect', window.location.href);
  } else if (!includes_default()(url).call(url, 'IRUPG')) {
    removeSessionStorageValue('urlUpgradeRedirect');
  }
};

// Exposed functions as window context functions
window.loginOBService = loginOBService;
if (window.location.hostname.match(/^pre\D+/g)) {
  window.reloadLoginVariables = () => {
    var _retrieveGlobalVariab3 = ibe_variables('reload');
    ibe_login_localeg = _retrieveGlobalVariab3.localeg;
    ibe_login_marketg = _retrieveGlobalVariab3.marketg;
    ibe_login_tokenURL = _retrieveGlobalVariab3.tokenURL;
    ibe_login_tokenUrlOB = _retrieveGlobalVariab3.tokenUrlOB;
    ibe_login_quadrigam = _retrieveGlobalVariab3.quadrigam;
    ibe_login_globalAppToken = _retrieveGlobalVariab3.globalAppToken;
    obLoginXML = _retrieveGlobalVariab3.obLoginXML;
    obLoginSAMLResp = _retrieveGlobalVariab3.obLoginSAMLResp;
    obLogoutXML = _retrieveGlobalVariab3.obLogoutXML;
    samlOBURL = _retrieveGlobalVariab3.samlOBURL;
  };
}

;// ./dev/js/inte-modules/ibe-modules/independent/ibe_login_lim.js































let ibe_login_lim_retrieveGlobalVariab = ibe_variables(),
  ibe_login_lim_localeg = ibe_login_lim_retrieveGlobalVariab.localeg,
  ibe_login_lim_marketg = ibe_login_lim_retrieveGlobalVariab.marketg,
  keyCloakTokenEndPoint = ibe_login_lim_retrieveGlobalVariab.keyCloakTokenEndPoint,
  keyCloakLoginClientId = ibe_login_lim_retrieveGlobalVariab.keyCloakLoginClientId,
  keyCloakAuthEndPoint = ibe_login_lim_retrieveGlobalVariab.keyCloakAuthEndPoint,
  keyCloakRegisterEndPoint = ibe_login_lim_retrieveGlobalVariab.keyCloakRegisterEndPoint;
const ibe_login_lim_storageErrorIBPLUSkey = 'ibplus-login-error';
const ibe_login_lim_storageIdentityState = 'ib-identity-stateReferral';
const verifierStorageKey = 'pkce_verifier';
const stateStorageKey = 'state';
const ibe_login_lim_getSessionStorageValue = storageKey => {
  try {
    return getSessionStorageValue(storageKey);
  } catch {
    return null;
  }
};
const ibe_login_lim_removeSessionStorageValue = storageKey => {
  try {
    removeSessionStorageValue(storageKey);
  } catch {
    return false;
  }
  return true;
};
const clearLoginErrorState = () => {
  [ibe_login_lim_storageIdentityState, verifierStorageKey, stateStorageKey].forEach(storageKey => {
    ibe_login_lim_removeSessionStorageValue(storageKey);
  });
};
const setSessionStorageError = type => {
  try {
    setSessionStorageValue(ibe_login_lim_storageErrorIBPLUSkey, type);
  } catch {
    return false;
  }
  return true;
};
const createSanitizedLoginError = errorType => {
  const callbackError = new Error('Se produjo un error durante la autenticación');
  callbackError.responseJSON = {
    error: errorType
  };
  return callbackError;
};
const ibe_login_lim_isLogado = () => {
  let accessToken;
  let accessTokenExpire;
  let refreshTokenTxt;
  let refreshTokenExpire;
  let accessTokenSalesforce;
  let accessTokenExpireSalesforce;
  let refreshTokenSalesforce;
  let userLogged = false;
  let userType = null;
  let accesTokenSF;
  let accessTokenSFExpire;
  let refreshTokenSF;
  let refreshTokenSFExpire,
    isSoftUser = false;
  const hasAccessCookie = !!Cookies.get('IBERIACOM_SSO_ACCESS');
  const hasAccessToCookie = !!Cookies.get('IBERIACOM_SSO_ACCESS_TO');
  const hasRefreshCookie = !!Cookies.get('IBERIACOM_SSO_REFRESH');
  const hasRefreshToCookie = !!Cookies.get('IBERIACOM_SSO_REFRESH_TO');
  accessToken = hasAccessCookie ? Cookies.get('IBERIACOM_SSO_ACCESS') : null;
  accessTokenExpire = hasAccessToCookie ? Cookies.get('IBERIACOM_SSO_ACCESS_TO') : null;
  refreshTokenTxt = hasRefreshCookie ? Cookies.get('IBERIACOM_SSO_REFRESH') : null;
  refreshTokenExpire = hasRefreshToCookie ? Cookies.get('IBERIACOM_SSO_REFRESH_TO') : null;
  accesTokenSF = hasAccessCookie ? Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE') : null;
  userType = accessToken ? 'IBPLUS' : null;
  userType = Cookies.get('IBERIACOM_SSO_TYPE') === 'IBZERO' ? 'IBZERO' : userType;
  isSoftUser = false;
  userLogged = (userType === 'IBPLUS' || userType === 'IBZERO') && refreshTokenTxt !== null && refreshTokenTxt !== undefined;
  return {
    userLogged,
    userType,
    accessToken,
    accesTokenSF,
    accessTokenExpire,
    accessTokenSFExpire,
    refreshTokenSF,
    refreshTokenSFExpire,
    refreshTokenTxt,
    refreshTokenExpire,
    accessTokenSalesforce,
    accessTokenExpireSalesforce,
    refreshTokenSalesforce,
    isSoftUser
  };
};
const ibe_login_lim_getCustomerDataSession = () => {
  const isLogged = ibe_login_lim_isLogado();
  if (isLogged.userLogged) {
    if (isLogged.userType === 'OB') return getSessionStorageValue('customerDataOB');
    if (isLogged.userType === 'IBZERO') return getSessionStorageValue('customerDataZero');
    return getSessionStorageValue('customerData');
  }
  return null;
};
const setLoginParams = payload => {
  const deferred = $.Deferred();
  const isLogged = ibe_login_lim_isLogado();
  const isObject = payload !== null && typeof payload === 'object';
  const validPayload = isObject && Object.hasOwn(payload, 'access_token') && typeof payload.access_token === 'string' && Object.hasOwn(payload, 'expires_in') && typeof payload.expires_in === 'number' && Object.hasOwn(payload, 'refresh_expires_in') && typeof payload.refresh_expires_in === 'number' && Object.hasOwn(payload, 'refresh_token') && typeof payload.refresh_token === 'string';
  if (!validPayload) {
    deferred.reject(new Error('Payload inválido'));
    return deferred.promise();
  }
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl0s/Integration/logOut'
    }
  }); // TODO: es necesario

  const isHttps = window.location.protocol === 'https:';
  const now = Date.now();
  const accessExpireAt = now + (payload.expires_in > 0 ? payload.expires_in * 1000 : 3600 * 1000);
  const refreshExpireAt = now + (payload.refresh_expires_in > 0 ? payload.refresh_expires_in * 1000 : 86400000);
  const buildCookie = (name, value, expiresAt) => {
    const securePart = isHttps ? '; Secure' : '';
    return "".concat(name, "=").concat(value, "; path=/; expires=").concat(new Date(expiresAt).toGMTString(), "; SameSite=Lax").concat(securePart);
  };
  document.cookie = buildCookie('IBERIACOM_SSO_ACCESS', payload.access_token, accessExpireAt);
  document.cookie = buildCookie('IBERIACOM_SSO_ACCESS_TO', getDateFormat(accessExpireAt, true), accessExpireAt);
  document.cookie = buildCookie('IBERIACOM_SSO_REFRESH', payload.refresh_token, refreshExpireAt);
  document.cookie = buildCookie('IBERIACOM_SSO_REFRESH_TO', getDateFormat(refreshExpireAt, true), refreshExpireAt);
  document.cookie = buildCookie('IBERIACOM_SSO_ACCESS_SALESFORCE', payload === null || payload === void 0 ? void 0 : payload['x-salesforce-token'], refreshExpireAt);
  document.cookie = buildCookie('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', getDateFormat(refreshExpireAt, true), refreshExpireAt);
  setSessionStorageValue('accessTokenSalesforce', payload === null || payload === void 0 ? void 0 : payload['x-salesforce-token']);
  try {
    const tokenPart = payload.access_token.split('.')[1];
    if (tokenPart) {
      var _token$realm_access;
      const token = JSON.parse(atob(tokenPart));
      const roles = token === null || token === void 0 || (_token$realm_access = token.realm_access) === null || _token$realm_access === void 0 ? void 0 : _token$realm_access.roles;
      if (Array.isArray(roles) && roles.length > 0) {
        const ssoType = includes_default()(roles).call(roles, 'ROLE_IBERIA_ZERO') ? 'IBZERO' : 'IBPLUS';
        document.cookie = buildCookie('IBERIACOM_SSO_TYPE', ssoType, refreshExpireAt); // TODO: antes se usaba refreshSF
      }
    }
  } catch (error) {
    console.warn('No se pudo decodificar el access_token', error);
  }
  if (isLogged !== null && isLogged !== void 0 && isLogged.isSoftUser) {
    setLocalStorageValue('IB_PERMANENT_LOGIN', 'true');
    removeSessionStorageValue('retrieveMemberDetailV2');
  }
  setSessionStorageValue('accessToken', payload.access_token);
  removeSessionStorageValue('anonymousToken');
  console.log('cookies seteadas');
  deferred.resolve();
  return deferred.promise();
};

/**
*  Function calls to salesforce to get information about token expiration and calls to
*   keycloack to get token
* reject: User weren't logged in
*/
const loginIBPlusLimService = () => {
  function base64UrlEncode(value) {
    const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function generateCodeVerifier() {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return base64UrlEncode(randomBytes);
  }
  function generateState() {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return base64UrlEncode(randomBytes);
  }
  async function generateCodeChallenge(verifier) {
    const verifierBytes = new TextEncoder().encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', verifierBytes);
    return base64UrlEncode(hash);
  }
  async function initKeycloakForm(url, layout) {
    try {
      const verifier = generateCodeVerifier();
      const state = generateState();
      const challenge = await generateCodeChallenge(verifier);
      setSessionStorageValue(verifierStorageKey, verifier);
      setSessionStorageValue(stateStorageKey, state);
      const authorizationUrl = new (url_default())(url);
      authorizationUrl.searchParams.set('client_id', keyCloakLoginClientId);
      authorizationUrl.searchParams.set('response_type', 'code');
      authorizationUrl.searchParams.set('scope', 'openid');
      authorizationUrl.searchParams.set('redirect_uri', window.location.origin + window.location.pathname);
      authorizationUrl.searchParams.set('code_challenge', challenge);
      authorizationUrl.searchParams.set('code_challenge_method', 'S256');
      authorizationUrl.searchParams.set('state', state);
      authorizationUrl.searchParams.set('kc_locale', ibe_login_lim_localeg);
      authorizationUrl.searchParams.set('lim_market', ibe_login_lim_marketg);
      if (layout) {
        authorizationUrl.searchParams.set('lim_layout', layout);
      }
      window.location.replace(authorizationUrl.toString());
    } catch {
      throw createSanitizedLoginError('pkce_init_error');
    }
  }
  const isValidCallbackState = (callbackState, storedState) => typeof callbackState === 'string' && callbackState.length > 0 && typeof storedState === 'string' && storedState.length > 0 && callbackState === storedState;
  const deferred = $.Deferred();
  const urlParams = getQuerystrParams();
  if (typeof urlParams.language === 'string' && urlParams.language.length > 0) {
    // TODO:urlRegisterSalesforce = urlRegisterSalesforce+'?language='+`${urlParams.language}`;
  }
  if (typeof urlParams.error === 'string' && urlParams.error.length > 0 || typeof urlParams.error_description === 'string' && urlParams.error_description.length > 0) {
    deferred.reject(createSanitizedLoginError('callback_error'));
  } else if (typeof urlParams.step === 'string' && urlParams.step === 'initLogin') {
    const layout = urlParams.layout || undefined;
    initKeycloakForm(keyCloakAuthEndPoint, layout).catch(error => {
      deferred.reject(error);
    });
  } else if (typeof urlParams.step === 'string' && urlParams.step === 'initRegister') {
    initKeycloakForm(keyCloakRegisterEndPoint).catch(error => {
      deferred.reject(error);
    });
  } else if (typeof urlParams.code === 'string' && urlParams.code.length > 0) {
    const verifier = ibe_login_lim_getSessionStorageValue(verifierStorageKey);
    const storedState = ibe_login_lim_getSessionStorageValue(stateStorageKey);
    if (!verifier || typeof verifier !== 'string' || !isValidCallbackState(urlParams.state, storedState)) {
      deferred.reject(createSanitizedLoginError('security_error'));
    } else {
      const headers = {
        'Content-type': 'application/x-www-form-urlencoded'
      };
      const params = {
        grant_type: 'authorization_code',
        code: decodeURIComponent(urlParams.code),
        redirect_uri: window.location.origin + window.location.pathname,
        client_id: keyCloakLoginClientId,
        code_verifier: verifier
      };
      callService(keyCloakTokenEndPoint, headers, params, 'POST').then(setLoginParams).then(() => deferred.resolve()).catch(() => deferred.reject(createSanitizedLoginError('token_exchange_error'))).always(() => {
        ibe_login_lim_removeSessionStorageValue(verifierStorageKey);
        ibe_login_lim_removeSessionStorageValue(stateStorageKey);
      });
    }
  } else if (typeof urlParams.externalpartner === 'string' && urlParams.externalpartner.length > 0) {
    if (urlParams.referralURL && !hasWhitelistedPartnersDomain(decodeURIComponent(urlParams.referralURL))) {
      window.location.href = '/';
    } else {
      setSessionStorageValue(ibe_login_lim_storageIdentityState, {
        externalObj: {
          externalPartner: urlParams.externalpartner,
          sessionId: urlParams.sessionId,
          referralURL: urlParams.referralURL ? decodeURIComponent(urlParams.referralURL) : undefined
        }
      });
      if (urlParams.externalpartner === 'ib_register_wineclub') {
        // TODO:window.location.href = `${urlRegisterSalesforce}`;
      } else if (urlParams.externalpartner === 'ibplustore') {
        // TODO:window.location.href = `${urlLoginSalesforce}01?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
      } else {
        // TODO:window.location.href = `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
      }
    }
  } else {
    const referralURL = typeof urlParams.referralURL === 'string' ? decodeURIComponent(urlParams.referralURL) : '';
    const sameDomain = hasReferralUrlSameDomain(referralURL);
    if (!sameDomain) {
      window.location.href = '/';
    } else {
      setSessionStorageValue(ibe_login_lim_storageIdentityState, {
        referralURL
      });
      // TODO:window.location.href = `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
    }
  }
  return deferred.promise();
};

/**
 * Main method to do login in Iberia after salesforce sucessful login
 * @return {*}
 */
function loginIBPlusLim() {
  const deferred = $.Deferred();
  const isLogged = ibe_login_lim_isLogado();
  const urlParams = getQuerystrParams();
  const loginSuccess = () => {
    let form;
    let externalURL;
    const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
    const refreshCookie = Cookies.get('IBERIACOM_SSO_REFRESH');
    // Tracking login success
    const eventData = {
      eventName: 'interaccion',
      eventCategory: 'intento de login',
      eventAction: 'clic',
      eventLabel: 'login ok'
    };
    if (typeof window.DigitalChange !== 'undefined') {
      window.DigitalChange('interaction', eventData);
    }
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push(eventData, {
        event: 'interaction'
      });
    }
    getMemberData(accessCookie, "".concat(ibe_login_lim_localeg, "-").concat(ibe_login_lim_marketg), ibe_login_lim_isLogado().userType).done(() => {
      var _paramsSF$register, _paramsSF$market, _paramsSF$language;
      const customerData = ibe_login_lim_getCustomerDataSession();
      const state = retrieveStateInfo(urlParams.state);
      const expDate = new Date(decodeURIComponent(isLogged.accessTokenExpire));
      const jsonSessionlogged = {
        first_name: customerData.name,
        last_name: customerData.surname
      };
      const jsonStringSession = JSON.stringify(jsonSessionlogged);
      const splitted = window.location.hostname.split('.');
      Cookies.set('IBERIACOM_SSO_SESION', btoa(jsonStringSession), {
        domain: ".".concat(splitted.slice(splitted.length - 2).join('.')),
        path: '/',
        expires: expDate,
        sameSite: 'strict'
      });

      // redireccion RRSS login params SalesForce
      const stateSF = state.referralURL;
      let paramsSF = {};
      try {
        const url = new (url_default())(stateSF);
        paramsSF = from_entries_default()(new (url_search_params_default())(url.search));
      } catch {
        paramsSF = from_entries_default()(new (url_search_params_default())(stateSF));
      }
      const _paramsSF = paramsSF,
        rrss = _paramsSF.rrss;
      /** @type {'1' | '2' | '3' | '4' | null } */
      const _paramsSF2 = paramsSF,
        typerrss = _paramsSF2.typerrss;
      const registerByTyperrss = {
        1: 'zero',
        2: 'plus'
      };
      /** @type {'plus' | 'zero' | null } */
      const registerParamState = (_paramsSF$register = paramsSF.register) !== null && _paramsSF$register !== void 0 ? _paramsSF$register : registerByTyperrss[typerrss];

      // locale-market del registro
      ibe_login_lim_marketg = (_paramsSF$market = paramsSF.market) !== null && _paramsSF$market !== void 0 ? _paramsSF$market : ibe_login_lim_marketg;
      ibe_login_lim_localeg = (_paramsSF$language = paramsSF.language) !== null && _paramsSF$language !== void 0 ? _paramsSF$language : ibe_login_lim_localeg;
      const universia = paramsSF.partner;
      const _paramsSF3 = paramsSF,
        invitationCode = _paramsSF3.invitationCode;
      const upgradeKO = paramsSF.UpgradeKO;
      const upgradeOK = paramsSF.UpgradeOK;
      const _paramsSF4 = paramsSF,
        registroClub = _paramsSF4.registroClub;
      let referral = state.referralURL;
      if (rrss != null && rrss === 'true') {
        var _localStorage$getItem;
        referral = (_localStorage$getItem = localStorage.getItem('returnURL')) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : state.referralURL;
      }

      // leemos y borramos session returnURL
      localStorage.removeItem('returnURL');
      if (ibe_login_lim_isLogado().userType === 'IBPLUS') {
        if (customerData.parentalControl) {
          if (state) {
            const params = getQuerystrParams(referral);
            if (Object.keys(params).length === 3 && params.invitationID && params.memberID && params.type) {
              setSessionStorageValue('ib-plus-app.nomination', params);
              const referralURLClean = decodeURIComponent(referral).split('?')[0];
              window.location = referralURLClean;
            } else if (state.externalPartner && state.externalPartner.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              const externalPartner = state.externalPartner;
              switch (externalPartner) {
                case 'ibplustore':
                  externalURL = $('[data-ibplustore-url]').data('ibplustore-url');
                  // Send token to iberiaplustore
                  form = $('<form>', {
                    method: 'POST',
                    action: "".concat(externalURL, "auth/ib"),
                    class: 'hidden'
                  });
                  form.append($('<input>', {
                    name: 'tokenIB',
                    value: accessCookie
                  }));
                  deleteloggedcookies();
                  $('body').append(form);
                  form.submit();
                  break;
                case 'ib_omnichannel_eva':
                  onIberiaPlusOmnichannelPartnerLogin({
                    referralURL: referral
                  });
                  break;
                case 'ib_dig_wineclub':
                  onIberiaPlusWineClubPartnerLogin({
                    referralURL: referral
                  });
                  break;
                case 'ib_register_wineclub':
                  onIberiaPlusWineClubPartnerLogin({
                    referralURL: referral
                  });
                  break;
                case 'aviosandmoney':
                  // dFrontJs.ibe_loading.open('body');
                  sendHotelCarsInfo();
                  break;
                case 'pgt':
                  externalURL = $('[data-ptg-url]').data('ptg-url');
                  const prmPTG = $.param({
                    partner: 'ib',
                    sessionId: state.sessionId
                  });
                  form = $('<form>', {
                    method: 'POST',
                    action: "".concat(externalURL, "?").concat(prmPTG),
                    class: 'hidden'
                  });
                  form.append($('<input>', {
                    name: 'accessToken',
                    value: accessCookie
                  })).append($('<input>', {
                    name: 'refreshToken',
                    value: refreshCookie
                  }));
                  $('body').append(form);
                  form.submit();
                  break;
                case 'eci':
                  externalURL = $('[data-eci-url]').data('eci-url');
                  // Send token to iberiaplustore
                  form = $('<form>', {
                    method: 'POST',
                    action: "".concat(externalURL),
                    class: 'hidden'
                  });
                  form.append($('<input>', {
                    name: 'access_token',
                    value: accessCookie
                  }));
                  form.append($('<input>', {
                    name: 'refresh_token',
                    value: refreshCookie
                  }));
                  form.append($('<input>', {
                    name: 'externalpartner',
                    value: 'ibp'
                  }));
                  deleteloggedcookies();
                  $('body').append(form);
                  form.submit();
                  break;
                default:
                  // Login externo
                  loginExternalPartnerService(externalPartner).done(datas => {
                    if (datas.params && datas.params.length > 0) {
                      form = $('<form>', {
                        method: 'POST',
                        action: datas.url,
                        class: 'hidden'
                      });
                      form.append($('<input>', {
                        name: 'market',
                        value: ibe_login_lim_marketg.toUpperCase()
                      })).append($('<input>', {
                        name: 'language',
                        value: ibe_login_lim_localeg.toLowerCase()
                      })).append($('<input>', {
                        name: datas.params[0].paramName,
                        value: datas.params[0].paramValue
                      }));
                    }
                  }).fail(() => {
                    generateLoginEvent(false);
                    logoutIBPlusService();
                    setSessionStorageValue(ibe_login_lim_storageErrorIBPLUSkey, 'general');
                    window.location.href = '/';
                    deferred.reject();
                  });
                  break;
              }
            } else {
              // Redireccionamiento registro SF landing Universia
              // eslint-disable-next-line no-lonely-if
              if (universia === 'LSUN') {
                // Redirecciona a la landing de la Iberia con partner de Universia
                window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/?partner=ZSUN");
              }
              // Redireccionamiento inicio de sesion para la invitacion
              else if (invitationCode) {
                window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/mi-iberia/#/IBMIBP?tab=your-benefits&tier-nomination=upgrade");
              } else if (registroClub) {
                window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/mi-iberia/#/IBMIBP?registratedUser=true");
              }
              // redireccion SalesForce RRSS IB PLUS
              else if (rrss != null && typerrss != null && rrss === 'true') {
                if (typerrss === 0) {
                  window.location.href = referral;
                } else {
                  const params = new (url_search_params_default())({
                    rrss,
                    typerrss
                  });
                  if (registerParamState) params.set('register', registerParamState);
                  const target = "?".concat(params.toString());
                  redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBPHOM', 'Page', target);
                }
              }
              // SF NO RRSS
              else if (rrss != null && typerrss != null && rrss === 'false') {
                if (typerrss === 0) {
                  const params = new (url_search_params_default())();
                  if (upgradeOK) {
                    window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/mi-iberia/#/profile");
                  } else if (registerParamState) params.set('register', registerParamState);
                  alert('normal referral');
                  const target = params.size > 0 ? "?".concat(params.toString()) : '';
                  redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBPHOM', 'Page', target);
                }
              } else if (referral && referral.length > 0) {
                generateLoginEvent(true);
                if (window.top === window.self) {
                  window.location.href = referral;
                }
              } else {
                generateLoginEvent(true);
                if (window.top === window.self) {
                  window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/");
                }
              }
            }
          }
          // fin state
          else {
            generateLoginEvent(true);
            if (window.top === window.self) {
              window.location.href = '/';
            }
          }
        }
        // error parental control
        else {
          logoutIBPlusService().always(() => {
            // dFrontJs.ibe_loading.close('body');
            // errormsg = loggedProperties.attr('data-inte-parentalcontrolmsg');
            // showErrorModal(errormsg);
            generateLoginEvent(false, {
              type: 'error',
              payload: 'parental-control'
            });
            if (window.top === window.self) {
              setSessionStorageValue(ibe_login_lim_storageErrorIBPLUSkey, 'parental-control');
              window.location.href = '/';
            }
            deferred.reject();
          });
        }
      } //FIN IBPLUS
      else if (ibe_login_lim_isLogado().userType === 'IBZERO') {
        var _state$externalPartne;
        if ((state === null || state === void 0 || (_state$externalPartne = state.externalPartner) === null || _state$externalPartne === void 0 ? void 0 : _state$externalPartne.length) > 0) {
          const externalPartner = state.externalPartner;
          // eslint-disable-next-line default-case
          switch (externalPartner) {
            case 'ib_omnichannel_eva':
              onIberiaZeroOmniChannelPartnerLogin({
                referralURL: referral
              });
              break;
            case 'ib_dig_wineclub':
              onIberiaZeroWineClubPartnerLogin({
                referralURL: referral
              });
              break;
            case 'ib_register_wineclub':
              onIberiaZeroWineClubPartnerLogin({
                referralURL: referral
              });
              break;
          }
          // redireccion SalesForce RRSS IB ZERO
        } else {
          // eslint-disable-next-line no-lonely-if
          if (rrss != null && typerrss != null) {
            /* Normal login */
            if (typerrss === 0 && !registerParamState) {
              window.location.href = referral;
              /* Iberia Zero Registration Form */
            } else if (typerrss === 0 && registerParamState) {
              if (upgradeKO) {
                window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/mi-iberia/#/IBMIBP?registerPopUp=true");
              }
              const params = new (url_search_params_default())({
                register: registerParamState
              });
              const target = "?".concat(params.toString());
              redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBPHOM', 'Page', target);
              /* Iberia Zero Registration Social Network */
            } else {
              const params = new (url_search_params_default())({
                rrss,
                typerrss
              });
              if (registerParamState) params.set('register', registerParamState);
              const target = "?".concat(params.toString());
              redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBPHOM', 'Page', target);
            }
          } else if (referral && referral.length > 0) {
            generateLoginEvent(true);
            if (window.top === window.self) {
              window.location.href = referral;
            }
          } else {
            generateLoginEvent(true);
            if (window.top === window.self) {
              window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/");
            }
          }
        }
      } else {
        generateLoginEvent(true);
        if (referral && referral.length > 0) {
          if (window.top === window.self) {
            window.location.href = referral;
          }
        } else {
          generateLoginEvent(true);
          if (window.top === window.self) {
            window.location.href = "/".concat(ibe_login_lim_marketg.toLowerCase(), "/").concat(ibe_login_lim_localeg.toLowerCase(), "/");
          }
        }
      }
    }).fail(() => {
      // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
      // showErrorModal(errormsg);
      logoutIBPlusService().always(() => {
        // dFrontJs.ibe_loading.close('body');
        removeSessionStorageValue(ibe_login_lim_storageIdentityState);
        generateLoginEvent(false);
        if (window.top === window.self) {
          setSessionStorageValue(ibe_login_lim_storageErrorIBPLUSkey, 'general');
          window.location.href = '/';
        }
        deferred.reject();
      });
    });
  };
  const loginFailure = err => {
    let error = err;
    error = error || {
      status: 0,
      responseJSON: null
    };
    const errorcode = error.responseJSON ? error.responseJSON.error : undefined;
    // Tracking login fail
    const eventData = {
      eventName: 'interaccion',
      eventCategory: 'intento de login',
      eventAction: 'clic',
      eventLabel: 'login ko'
    };
    if (typeof window.DigitalChange !== 'undefined') {
      window.DigitalChange('interaction', eventData);
    }
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push(eventData, {
        event: 'interaction'
      });
    }
    clearLoginErrorState();
    // Error cases
    // Suposing that comes from service
    if (errorcode === 'pkce_init_error' || errorcode === 'callback_error' || errorcode === 'security_error' || errorcode === 'token_exchange_error') {
      generateLoginEvent(false, {
        type: 'error',
        payload: 'general',
        step: errorcode
      });
      deleteloggedcookies();
      if (window.top === window.self) {
        setSessionStorageError('general');
        window.location.href = '/';
      }
    } else if (errorcode === 'invalid_grant') {
      // errormsg = (error.responseJSON.loggedBy !== 'email') ? loggedProperties.attr('data-inte-invalidcredentialsmsg') : loggedProperties.attr('data-inte-invalidcredentialsemail');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      if (window.top === window.self) {
        setSessionStorageError('general');
        window.location.href = '/';
      }
    } else if (errorcode === 'invalid_grant_mail') {
      // errormsg = loggedProperties.attr('data-inte-repeatedmailmsg');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      if (window.top === window.self) {
        setSessionStorageError('general');
        window.location.href = '/';
      }
      // Temporal and permanent blocked users
    } else if (errorcode === 'invalid_grant_BT') {
      redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBBLUT');
    } else if (errorcode === 'invalid_grant_BP') {
      redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBBLUS');
      // User logged with an expired pin
    } else if (errorcode === 'invalid_grant_PE') {
      setSessionStorageValue('ib-plus-app.passwordExpired', true);
      redirectByQuadrigam(ibe_login_lim_marketg, ibe_login_lim_localeg, 'IBOLPS');
    } else {
      // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      deleteloggedcookies();
      if (window.top === window.self) {
        setSessionStorageError('general');
        window.location.href = '/';
      }
    }
    deferred.reject();
  };
  if (!isLogged.userLogged || isLogged.userLogged && isLogged.isSoftUser) {
    loginIBPlusLimService().then(loginSuccess, loginFailure);
  } else if (isLogged.userLogged) {
    if (urlParams.externalpartner && urlParams.externalpartner.length > 0) {
      logoutIBPlusService().always(() => {
        loginIBPlusLim();
      });
    } else if (urlParams.referralURL && urlParams.referralURL.length > 0) {
      window.location.href = decodeURIComponent(urlParams.referralURL);
    } else {
      window.location.href = '/';
    }
    deferred.resolve();
  } else {
    window.location.href = '/';
    deferred.reject();
  }
  return deferred.promise();
}
const ibe_login_lim_event = new CustomEvent('IDENTITY_LOGIN_ONPAGE');
window.parent.dispatchEvent(ibe_login_lim_event);
dFrontJs.ibe_loading.open();
loginIBPlusLim.call({
  callerID: 'WCS'
});
})();

/******/ })()
;
//# sourceMappingURL=ibe_login_lim.js.map