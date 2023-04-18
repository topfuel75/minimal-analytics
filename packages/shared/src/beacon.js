"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBeacon = exports.sendBeaconFetch = exports.sendBeaconXHR = void 0;
const syncEvents = new Set(['unload', 'beforeunload', 'pagehide']);
function sendBeaconXHR(url, data) {
    var _a;
    const eventType = (_a = this === null || this === void 0 ? void 0 : this.event) === null || _a === void 0 ? void 0 : _a.type;
    const sync = syncEvents.has((eventType || '').toLowerCase());
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, !sync);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', '*/*');
    if (typeof data === 'string') {
        xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhr.responseType = 'text';
    }
    else if ((data instanceof Blob) && data.type) {
        xhr.setRequestHeader('Content-Type', data.type);
    }
    try {
        xhr.send(data);
    }
    catch (error) {
        return false;
    }
    return true;
}
exports.sendBeaconXHR = sendBeaconXHR;
function sendBeaconFetch(url, data) {
    try {
        fetch(url, {
            method: 'POST',
            body: data,
            credentials: 'include',
            mode: 'cors',
            keepalive: true,
        })
            .catch(() => { });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.sendBeaconFetch = sendBeaconFetch;
function sendBeacon(url, data) {
    const hasBeaconApi = (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function');
    if (hasBeaconApi) {
        if (data) {
            return navigator.sendBeacon(url, data);
        }
        return navigator.sendBeacon(url);
    }
    const hasXHR = (typeof XMLHttpRequest !== 'undefined');
    if (hasXHR) {
        if (data) {
            return sendBeaconXHR(url, data);
        }
        return sendBeaconXHR(url);
    }
    const hasFetch = (typeof fetch !== 'undefined');
    if (hasFetch) {
        if (data) {
            return sendBeaconFetch(url, data);
        }
        return sendBeaconFetch(url);
    }
    return false;
}
exports.sendBeacon = sendBeacon;
//# sourceMappingURL=beacon.js.map