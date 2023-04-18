"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventParams = exports.getSessionState = exports.getSessionId = exports.getClientId = exports.getDocument = exports.counterKey = exports.sessionKey = exports.clientKey = void 0;
const storage_1 = require("./storage");
const utility_1 = require("./utility");
const clientKey = 'clientId';
exports.clientKey = clientKey;
const sessionKey = 'sessionId';
exports.sessionKey = sessionKey;
const counterKey = 'sessionCount';
exports.counterKey = counterKey;
const LocalStorage = (0, storage_1.safeStorageFactory)('localStorage', storage_1.MemoryStorage);
const SessionStorage = (0, storage_1.safeStorageFactory)('sessionStorage', storage_1.MemoryStorage);
function getDocument() {
    var _a, _b, _c;
    const root = (0, storage_1.getRootObject)();
    const location = ((_a = root.document) === null || _a === void 0 ? void 0 : _a.location) || root.location;
    const { hostname, origin, pathname, search } = location || {};
    const title = (_b = root.document) === null || _b === void 0 ? void 0 : _b.title;
    const referrer = (_c = root.document) === null || _c === void 0 ? void 0 : _c.referrer;
    return { location: origin + pathname + search, hostname, pathname, referrer, title };
}
exports.getDocument = getDocument;
let supportsLocalStorage = null;
function maybeWarnStorage() {
    if (typeof supportsLocalStorage !== 'boolean') {
        const root = (0, storage_1.getRootObject)();
        const hasLocalStorage = (0, storage_1.hasStorage)('localStorage');
        const isLocalStorageSupported = (0, storage_1.isStorageClassSupported)(root['localStorage']);
        supportsLocalStorage = (hasLocalStorage && isLocalStorageSupported);
    }
    if (!supportsLocalStorage) {
        console.warn('Minimal Analytics: localStorage not available, ClientID will not be persisted.');
    }
}
function getClientId(key = clientKey) {
    const storedValue = LocalStorage.getItem(key);
    if (storedValue) {
        return storedValue;
    }
    maybeWarnStorage();
    const clientId = (0, utility_1.getRandomId)();
    LocalStorage.setItem(key, clientId);
    return clientId;
}
exports.getClientId = getClientId;
function getSessionId(key = sessionKey) {
    const storedValue = SessionStorage.getItem(key);
    if (storedValue) {
        return storedValue;
    }
    const sessionId = (0, utility_1.getRandomId)();
    SessionStorage.setItem(key, sessionId);
    return sessionId;
}
exports.getSessionId = getSessionId;
function getSessionCount(key = counterKey) {
    let sessionCount = '1';
    const storedValue = SessionStorage.getItem(key);
    if (storedValue) {
        sessionCount = `${+storedValue + 1}`;
    }
    SessionStorage.setItem(key, sessionCount);
    return sessionCount;
}
function getSessionState(firstEvent) {
    const firstVisit = !LocalStorage.getItem(clientKey) ? '1' : void 0;
    const sessionStart = !SessionStorage.getItem(sessionKey) ? '1' : void 0;
    let sessionCount = SessionStorage.getItem(counterKey) || '1';
    if (firstEvent) {
        sessionCount = getSessionCount();
    }
    return { firstVisit, sessionStart, sessionCount };
}
exports.getSessionState = getSessionState;
function getEventParams(event) {
    if (Array.isArray(event)) {
        return event.map((items) => items.map((item) => item === null || item === void 0 ? void 0 : item.toString()));
    }
    return Object.keys(event).map((key) => [key, `${event[key]}`]);
}
exports.getEventParams = getEventParams;
//# sourceMappingURL=values.js.map