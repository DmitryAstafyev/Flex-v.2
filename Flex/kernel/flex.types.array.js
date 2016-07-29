// LICENSE
// This file (core / module) is released under the MIT License. See [LICENSE] file for details.
/*global flex*/
/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Module define class Array with binding features.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var privates        = null,
                ExArray         = null;
            ExArray     = function (defaults) {
                var self        = this,
                    original    = [],
                    handles     = {
                        'set'       : {},
                        'add'       : {},
                        'remove'    : {}
                    },
                    aliases     = {
                        'set'   : ['update'],
                        'add'   : ['new', 'push', 'unshift'],
                        'remove': ['del', 'delete', 'shift', 'pop'],
                    },
                    errors      = {
                        WRONG_EVENT_NAME        : '0000: WRONG_EVENT_NAME',
                        HANDLE_ISNOT_FUNCTION   : '0001: HANDLE_ISNOT_FUNCTION',
                        SAME_ID_OF_HANDLE       : '0002: SAME_ID_OF_HANDLE',
                        HANDLE_OR_ID_SHOULD_BE  : '0003: HANDLE_OR_ID_SHOULD_BE',
                        INVALID_LENGTH          : '0004: INVALID_LENGTH'
                    };
                function getEventName(type) {
                    var result = handles[type] !== void 0 ? type : null;
                    if (result === null) {
                        for (var key in aliases) {
                            if (aliases[key].indexOf(type) !== -1) {
                                result = key;
                                break;
                            }
                        }
                    }
                    return result;
                }
                function executeHandles(event) {
                    _object(handles[event.type]).forEach(function (id, handle) {
                        handle.call(self, event);
                    });
                }
                function setIndex(index) {
                    if (self[index] === void 0) {
                        Object.defineProperty(self, index, {
                            configurable: true,
                            enumerable  : true,
                            get         : function () {
                                return original[index];
                            },
                            set         : function (value) {
                                original[index] = value;
                                executeHandles({
                                    type    : 'set',
                                    index   : index,
                                    item    : value
                                });
                            }
                        });
                    }
                }
                Object.defineProperty(self, "bind", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function (type, handle, id) {
                        type = getEventName(type);
                        if (type !== null) {
                            if (typeof handle === 'function') {
                                id = typeof id === 'string' ? id : flex.unique();
                                if (handles[type][id] === void 0) {
                                    handles[type][id] = handle;
                                } else {
                                    throw new Error(errors.SAME_ID_OF_HANDLE);
                                }
                            } else {
                                throw new Error(errors.HANDLE_ISNOT_FUNCTION);
                            }
                        } else {
                            throw new Error(errors.WRONG_EVENT_NAME);
                        }
                    }
                });
                Object.defineProperty(self, "unbind", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function (type, handle_or_id) {
                        type = getEventName(type);
                        if (type !== null) {
                            if (typeof handle_or_id === 'function') {
                                for (var id in handles[type]) {
                                    if (handles[type][id] === handle_or_id) {
                                        delete handles[type][id];
                                        return true;
                                    }
                                }
                                return false;
                            } else if (typeof handle_or_id === 'string') {
                                if (handles[type][handle_or_id] !== void 0) {
                                    delete handles[type][handle_or_id];
                                    return true;
                                }
                                return false;
                            } else {
                                throw new Error(errors.HANDLE_OR_ID_SHOULD_BE);
                            }
                        } else {
                            throw new Error(errors.WRONG_EVENT_NAME);
                        }
                    }
                });
                Object.defineProperty(self, "pop", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function () {
                        if (original.length > -1) {
                            var item = original.pop();
                            delete self[original.length];
                            executeHandles({
                                type    : "remove",
                                index   : original.length,
                                item    : item
                            });
                            return item;
                        }
                    }
                });
                Object.defineProperty(self, "push", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        for (var i = 0, length = arguments.length; i < length; i++) {
                            original.push(arguments[i]);
                            setIndex(original.length - 1);
                            executeHandles({
                                type    : "add",
                                index   : original.length - 1,
                                item    : arguments[i]
                            });
                        }
                        return original.length;
                    }
                });
                Object.defineProperty(self, "unshift", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        for (var i = 0, ln = arguments.length; i < ln; i++) {
                            original.splice(i, 0, arguments[i]);
                            setIndex(original.length - 1);
                            executeHandles({
                                type    : "add",
                                index   : i,
                                item    : arguments[i]
                            });
                        }
                        for (; i < original.length; i++) {
                            executeHandles({
                                type    : "set",
                                index   : i,
                                item    : original[i]
                            });
                        }
                        return original.length;
                    }
                });
                Object.defineProperty(self, "shift", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        var item = null;
                        if (original.length > 0) {
                            item = original.shift();
                            original.length === 0 && delete self[0];
                            executeHandles({
                                type    : "remove",
                                index   : 0,
                                item    : item
                            });
                            return item;
                        }
                    }
                });
                Object.defineProperty(self, "splice", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function (start, count /*, item_0, item_1, ... item_n */) {
                        var removed = [],
                            item    = null,
                            _start  = null;
                        start   = start !== void 0 ? (start > original.length - 1 ? original.length : start) : 0;
                        count   = count !== void 0 ? count : original.length - start;
                        _start  = start < 0 ? original.length + start : start;
                        while (count--) {
                            item = original.splice(_start, 1)[0];
                            removed.push(item);
                            delete self[original.length];
                            executeHandles({
                                type    : "remove",
                                index   : start + removed.length - 1,
                                item    : item
                            });
                        }
                        for (var i = 2, ln = arguments.length; i < ln; i++) {
                            original.splice(_start, 0, arguments[i]);
                            setIndex(original.length - 1);
                            executeHandles({
                                type    : "add",
                                index   : _start,
                                item    : arguments[i]
                            });
                            _start++;
                        }
                        return removed;
                    }
                });
                Object.defineProperty(self, "fill", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function (value, start, end) {
                        var O               = Object(original),
                            start           = start === void 0 ? 0 : start,
                            end             = end === void 0 ? original.length : end,
                            len             = O.length >>> 0,
                            relativeStart   = start >> 0,
                            k               = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len),
                            relativeEnd     = end === undefined ? len : end >> 0,
                            final           = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
                        while (k < final) {
                            O[k] = value;
                            executeHandles({
                                type    : "set",
                                index   : k,
                                item    : value
                            });
                            k++;
                        }
                        return O;
                    }
                });
                Object.defineProperty(self, "length", {
                    configurable: false,
                    enumerable  : false,
                    get         : function () {
                        return original.length;
                    },
                    set         : function (value) {
                        var n = Number(value);
                        if (n % 1 === 0 && n >= 0) {
                            if (n < original.length) {
                                self.splice(n);
                            } else if (n > original.length) {
                                self.push.apply(self, new Array(n - original.length));
                            }
                        } else {
                            throw new RangeError(errors.INVALID_LENGTH);
                        }
                        return value;
                    }
                });
                Object.defineProperty(self, "concat", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function (/*, item_0, item_1, ... item_n */) {
                        var res = [].concat(original);
                        for (var i = 0, ln = arguments.length; i < ln; i++) {
                            if (arguments[i] instanceof Array) {
                                res = res.concat(arguments[i]);
                            } else if (arguments[i] instanceof ExArray) {
                                res = res.concat(arguments[i].getOriginal());
                            } else {
                                res.push(arguments[i]);
                            }
                        }
                        return new ExArray(res);
                        //return res;
                    }
                });
                Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
                    if (self[name] === void 0) {
                        Object.defineProperty(self, name, {
                            configurable: false,
                            enumerable  : false,
                            writable    : false,
                            value       : Array.prototype[name]
                        });
                    }
                });
                if (defaults instanceof Array) {
                    self.push.apply(self, defaults);
                }
            };
            privates    = {
                ExArray: ExArray
            };
            return {
                ExArray: privates.ExArray
            };
        };
        flex.modules.attach({
            name            : 'types.array',
            protofunction   : protofunction
        });
    }
}());
