"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MemoryStorage_map;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStorageClassSupported = exports.hasStorage = exports.safeStorageFactory = exports.MemoryStorage = exports.getRootObject = void 0;
function getRootObject() {
    if (typeof self === 'object') {
        return self;
    }
    else if (typeof window === 'object') {
        return window;
    }
}
exports.getRootObject = getRootObject;
function hasStorage(name) {
    const root = getRootObject();
    return (root && typeof root[name] !== 'undefined');
}
exports.hasStorage = hasStorage;
function isStorageClassSupported(storageInstance) {
    try {
        const testKey = "___storage_test___";
        storageInstance.setItem(testKey, testKey);
        const testValue = storageInstance.getItem(testKey);
        storageInstance.removeItem(testKey);
        return (testKey === testValue);
    }
    catch (e) {
        return false;
    }
}
exports.isStorageClassSupported = isStorageClassSupported;
class MemoryStorage {
    constructor() {
        _MemoryStorage_map.set(this, void 0);
        this.clear();
    }
    clear() {
        __classPrivateFieldSet(this, _MemoryStorage_map, new Map(), "f");
    }
    key(index) {
        return __classPrivateFieldGet(this, _MemoryStorage_map, "f").values()[index] || null;
    }
    getItem(name) {
        return __classPrivateFieldGet(this, _MemoryStorage_map, "f").get(name) || null;
    }
    setItem(name, value) {
        __classPrivateFieldGet(this, _MemoryStorage_map, "f").set(name, value);
    }
    removeItem(name) {
        __classPrivateFieldGet(this, _MemoryStorage_map, "f").delete(name);
    }
    get length() {
        return __classPrivateFieldGet(this, _MemoryStorage_map, "f").size;
    }
}
exports.MemoryStorage = MemoryStorage;
_MemoryStorage_map = new WeakMap();
function safeStorageFactory(storageClassName, defaultStorageClass) {
    const hasStorageClass = hasStorage(storageClassName);
    if (!hasStorageClass) {
        return new defaultStorageClass();
    }
    const root = getRootObject();
    const storageInstance = root[storageClassName];
    const storageClassSupported = isStorageClassSupported(storageInstance);
    if (!storageClassSupported) {
        return new defaultStorageClass();
    }
    return storageInstance;
}
exports.safeStorageFactory = safeStorageFactory;
//# sourceMappingURL=storage.js.map