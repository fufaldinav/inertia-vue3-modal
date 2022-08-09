/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 679:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ 263:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ })

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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "InertiaModal": () => (/* reexport */ InertiaModal),
  "ModalSlot": () => (/* reexport */ ModalSlot),
  "ModalableWrapper": () => (/* reexport */ ModalableWrapper),
  "getModal": () => (/* reexport */ isModal),
  "usePage": () => (/* reexport */ usePage)
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__(679)
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ const setPublicPath = (null);

;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

;// CONCATENATED MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
const external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject = require("vue");
;// CONCATENATED MODULE: external "@inertiajs/inertia"
const inertia_namespaceObject = require("@inertiajs/inertia");
;// CONCATENATED MODULE: external "axios"
const external_axios_namespaceObject = require("axios");
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_namespaceObject);
// EXTERNAL MODULE: ./node_modules/axios/lib/cancel/Cancel.js
var Cancel = __webpack_require__(263);
var Cancel_default = /*#__PURE__*/__webpack_require__.n(Cancel);
;// CONCATENATED MODULE: ./resources/js/events.ts
function fireEvent(name, options) {
    return document.dispatchEvent(new CustomEvent("inertia:".concat(name), options));
}
var fireErrorEvent = function (errors) { return fireEvent('error', { detail: { errors: errors } }); };
var fireSuccessEvent = function (page) { return fireEvent('success', { detail: { page: page } }); };

;// CONCATENATED MODULE: ./resources/js/uniqueId.ts
var id = 1;
/* harmony default export */ const uniqueId = (function () { return "id-".concat(id++); });

;// CONCATENATED MODULE: ./resources/js/symbols.ts
var injectIsModal = 'InertiaIsModal';
var modalSlotRef = 'ModalSlotRef';
var modalHeader = 'X-Inertia-Modal';

;// CONCATENATED MODULE: ./resources/js/useModalSlot.ts


var provider = function () {
    var teleportRef = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.shallowRef)(null);
    var setTelRef = function (el) {
        teleportRef.value = el;
    };
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.provide)(modalSlotRef, setTelRef);
    return teleportRef;
};
var injector = function () { return (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.inject)(modalSlotRef); };

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/ts-loader/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/InertiaModal.vue?vue&type=script&setup=true&lang=ts



var __default__ = {
    name: 'InertiaModal',
};








/* harmony default export */ const InertiaModalvue_type_script_setup_true_lang_ts = (/*#__PURE__*/(0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.defineComponent)(__assign(__assign({}, __default__), { props: {
        component: String,
        componentAttrs: Object,
        modalKey: {
            type: String,
            default: '',
        },
    }, setup: function (__props) {
        var props = __props;
        var modal = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.shallowRef)(null);
        var telRef = provider();
        (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.provide)(injectIsModal, modal);
        var close = function () {
            if (modal.value) {
                if (!modal.value.loading) {
                    // remove the 'x-inertia-modal' and 'x-inertia-modal-redirect-back' headers for future requests
                    modal.value.removeBeforeEventListener();
                    if (modal.value.removeSuccessEventListener) {
                        modal.value.removeSuccessEventListener();
                    }
                    external_axios_default().interceptors.response.eject(modal.value.interceptor);
                }
                if (modal.value.cancelToken.value) {
                    modal.value.cancelToken.value.cancel('Modal closed');
                }
                if ('onClose' in modal.value && modal.value.onClose) {
                    modal.value.onClose(modal.value);
                }
            }
            document.dispatchEvent(new CustomEvent('inertia:modal-closed', { detail: modal.value }));
            modal.value = null;
        };
        var visitInModal = function (url, options) {
            var _a;
            if (options === void 0) { options = {}; }
            var opts = __assign({ headers: {}, redirectBack: true, modalProps: {}, pageProps: {} }, options);
            var cancelToken = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.shallowRef)(null);
            var hrefToUrl = function (href) { return new URL(href.toString(), window.location.toString()); };
            var currentId = uniqueId();
            var lastPage;
            var lastVisit = null;
            var interceptor = external_axios_default().interceptors.response.use(function (response) {
                if (response.headers[modalHeader.toLowerCase()] === currentId) {
                    var page_1 = response.data;
                    page_1.url = hrefToUrl(page_1.url);
                    if ((lastVisit === null || lastVisit === void 0 ? void 0 : lastVisit.only) && lastPage && lastPage.component === page_1.component) {
                        page_1.props = __assign(__assign({}, lastPage.props), page_1.props);
                    }
                    // @ts-ignore Protected but we have to use it, no other way
                    var _a = lastVisit ? inertia_namespaceObject.Inertia.activeVisit : opts, onError_1 = _a.onError, onSuccess_1 = _a.onSuccess, errorBag_1 = _a.errorBag;
                    // @ts-ignore Protected but we have to use it, no other way
                    Promise.resolve(inertia_namespaceObject.Inertia.resolveComponent(page_1.component)).then(function (component) {
                        var errors = page_1.props.errors || {};
                        if (Object.keys(errors).length > 0) {
                            var scopedErrors = errorBag_1 ? errors[errorBag_1] || {} : errors;
                            fireErrorEvent(scopedErrors);
                            if (onError_1)
                                onError_1(scopedErrors);
                        }
                        else {
                            fireSuccessEvent(page_1);
                            if (onSuccess_1)
                                onSuccess_1(page_1);
                        }
                        return component;
                    }).then(function (component) {
                        // @ts-ignore Protected but we have to use it, no other way
                        inertia_namespaceObject.Inertia.finishVisit(inertia_namespaceObject.Inertia.activeVisit);
                        var removeSuccessEventListener;
                        if (modal.value && 'removeBeforeEventListener' in modal.value) {
                            modal.value.removeBeforeEventListener();
                        }
                        var removeBeforeEventListener = inertia_namespaceObject.Inertia.on('before', function (event) {
                            // Subsequent visit of the modal url will stay in the modal
                            if (event.detail.visit.url.pathname === page_1.url.pathname) {
                                // make sure the backend knows we're requesting from within a modal
                                event.detail.visit.headers[modalHeader] = currentId;
                                lastVisit = event.detail.visit;
                                lastPage = page_1;
                                var reqInterceptor_1 = external_axios_default().interceptors.request.use(function (config) {
                                    if (config.headers[modalHeader] === currentId) {
                                        external_axios_default().interceptors.request.eject(reqInterceptor_1);
                                        config.headers['X-Inertia-Partial-Component'] = page_1.component;
                                    }
                                    return config;
                                });
                            }
                            else if (opts.redirectBack) {
                                event.detail.visit.headers['X-Inertia-Modal-Redirect-Back'] = 'true';
                                if (typeof opts.redirectBack === 'function') {
                                    removeSuccessEventListener = inertia_namespaceObject.Inertia.on('success', opts.redirectBack);
                                }
                            }
                        });
                        modal.value = {
                            loading: false,
                            component: component,
                            removeBeforeEventListener: removeBeforeEventListener,
                            removeSuccessEventListener: removeSuccessEventListener,
                            interceptor: interceptor,
                            page: page_1,
                            cancelToken: cancelToken,
                            onClose: opts.onClose,
                            props: opts.modalProps,
                            pageProps: opts.pageProps,
                            close: close,
                        };
                    });
                    return Promise.reject(new (Cancel_default())());
                }
                return response;
            });
            inertia_namespaceObject.Inertia.visit(url, __assign(__assign({}, opts), { onCancelToken: function (token) {
                    cancelToken.value = token;
                }, headers: __assign(__assign({}, opts.headers), (_a = {}, _a[modalHeader] = currentId, _a)) }));
            modal.value = { loading: true, cancelToken: cancelToken, close: close };
        };
        (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.watch)(function () { return props.modalKey; }, function (key) {
            var fn = "visitInModal".concat(key);
            // @ts-ignore
            inertia_namespaceObject.Inertia[fn] = visitInModal;
        }, { immediate: true });
        return function (_ctx, _cache) {
            return ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal))
                ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.Fragment, { key: 0 }, [
                    (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.renderSlot)(_ctx.$slots, "default", {
                        loading: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).loading,
                        component: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).component,
                        page: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).page,
                        close: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).close,
                        props: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).props
                    }),
                    ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).component && (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(telRef))
                        ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.Teleport, {
                            key: 0,
                            to: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(telRef)
                        }, [
                            ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createBlock)((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.resolveDynamicComponent)((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).component), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.mergeProps)({ "is-modal": "" }, __assign(__assign({}, (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).page.props), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(modal).pageProps)), null, 16))
                        ], 8, ["to"]))
                        : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createCommentVNode)("", true)
                ], 64))
                : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createCommentVNode)("", true);
        };
    } })));

;// CONCATENATED MODULE: ./resources/js/InertiaModal.vue?vue&type=script&setup=true&lang=ts
 
;// CONCATENATED MODULE: ./resources/js/InertiaModal.vue



const __exports__ = InertiaModalvue_type_script_setup_true_lang_ts;

/* harmony default export */ const InertiaModal = (__exports__);
;// CONCATENATED MODULE: ./resources/js/isModal.ts


/* harmony default export */ const isModal = (function () { return (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.inject)(injectIsModal, false); });

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/ts-loader/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/ModalSlot.vue?vue&type=script&setup=true&lang=ts



var ModalSlotvue_type_script_setup_true_lang_ts_default_ = {
    name: 'ModalSlot',
};

/* harmony default export */ const ModalSlotvue_type_script_setup_true_lang_ts = (/*#__PURE__*/(0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.defineComponent)(__assign(__assign({}, ModalSlotvue_type_script_setup_true_lang_ts_default_), { setup: function (__props) {
        var ref = injector();
        return function (_ctx, _cache) {
            return ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)("div", { ref: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(ref) }, null, 512));
        };
    } })));

;// CONCATENATED MODULE: ./resources/js/ModalSlot.vue?vue&type=script&setup=true&lang=ts
 
;// CONCATENATED MODULE: ./resources/js/ModalSlot.vue



const ModalSlot_exports_ = ModalSlotvue_type_script_setup_true_lang_ts;

/* harmony default export */ const ModalSlot = (ModalSlot_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/ts-loader/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/ModalableWrapper.vue?vue&type=script&setup=true&lang=ts



var ModalableWrappervue_type_script_setup_true_lang_ts_default_ = {
    name: 'ModalableWrapper',
};



/* harmony default export */ const ModalableWrappervue_type_script_setup_true_lang_ts = (/*#__PURE__*/(0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.defineComponent)(__assign(__assign({}, ModalableWrappervue_type_script_setup_true_lang_ts_default_), { setup: function (__props) {
        var telRef = provider();
        var inModal = isModal();
        return function (_ctx, _cache) {
            return ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.Fragment, null, [
                (!(0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(inModal))
                    ? (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.renderSlot)(_ctx.$slots, "default", { key: 0 }, function () { return [
                        (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createVNode)(ModalSlot)
                    ]; })
                    : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.renderSlot)(_ctx.$slots, "modal-only", {
                        key: 1,
                        close: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(inModal).close
                    }, function () { return [
                        (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createVNode)(ModalSlot)
                    ]; }),
                ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(telRef))
                    ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.Teleport, {
                        key: 2,
                        to: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(telRef)
                    }, [
                        (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.renderSlot)(_ctx.$slots, "modal", {
                            close: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.unref)(inModal).close
                        })
                    ], 8, ["to"]))
                    : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createCommentVNode)("", true)
            ], 64));
        };
    } })));

;// CONCATENATED MODULE: ./resources/js/ModalableWrapper.vue?vue&type=script&setup=true&lang=ts
 
;// CONCATENATED MODULE: ./resources/js/ModalableWrapper.vue



const ModalableWrapper_exports_ = ModalableWrappervue_type_script_setup_true_lang_ts;

/* harmony default export */ const ModalableWrapper = (ModalableWrapper_exports_);
;// CONCATENATED MODULE: external "@inertiajs/inertia-vue3"
const inertia_vue3_namespaceObject = require("@inertiajs/inertia-vue3");
;// CONCATENATED MODULE: ./resources/js/usePage.ts



/* harmony default export */ const usePage = (function () {
    var modal = isModal();
    var parent = (0,inertia_vue3_namespaceObject.usePage)();
    if (modal && modal.value) {
        return {
            isModal: true,
            parent: parent,
            props: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.computed)(function () { return (modal.value && !modal.value.loading ? modal.value.page.props : {}); }),
            url: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.computed)(function () { return modal.value && !modal.value.loading && modal.value.page.url; }),
            component: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.computed)(function () { return modal.value && !modal.value.loading && modal.value.page.component; }),
            version: (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.computed)(function () { return modal.value && !modal.value.loading && modal.value.page.version; }),
        };
    }
    return parent;
});

;// CONCATENATED MODULE: ./resources/js/index.ts






;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js



})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=inertia-vue-modal.common.js.map