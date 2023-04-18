"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlData = exports.isTargetElement = exports.getScrollPercentage = exports.getHashId = exports.getRandomId = exports.debounce = void 0;
function debounce(callback, frequency = 300, timer = 0) {
    return (...args) => (clearTimeout(timer), (timer = setTimeout(callback, frequency, ...args)));
}
exports.debounce = debounce;
function getRandomId(length = 16) {
    const randomId = `${Math.floor(Math.random() * 1e16)}`;
    length = length > 16 ? 16 : length;
    return randomId.padStart(length, '0').substring(-1, length);
}
exports.getRandomId = getRandomId;
function getHashId(value, length = 16) {
    let hash = 0;
    for (let index = 0; index < value.length; index++) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash = hash & hash;
    }
    hash = Math.abs(hash);
    return `${hash}`.padStart(length, '0').substring(-1, length);
}
exports.getHashId = getHashId;
function getScrollPercentage() {
    const body = document.body;
    const scrollTop = window.pageYOffset || body.scrollTop;
    const { scrollHeight, offsetHeight, clientHeight } = document.documentElement;
    const documentHeight = Math.max(body.scrollHeight, scrollHeight, body.offsetHeight, offsetHeight, body.clientHeight, clientHeight);
    const trackLength = documentHeight - window.innerHeight;
    return Math.floor(Math.abs(scrollTop / trackLength) * 100);
}
exports.getScrollPercentage = getScrollPercentage;
function isTargetElement(element, selector) {
    let target = element;
    while (target) {
        if ((target === null || target === void 0 ? void 0 : target.matches) && (target === null || target === void 0 ? void 0 : target.matches(selector))) {
            break;
        }
        target = target === null || target === void 0 ? void 0 : target.parentNode;
    }
    return target;
}
exports.isTargetElement = isTargetElement;
function getUrlData(urlValue) {
    let hostname, pathname;
    let isExternal = false;
    try {
        ({ hostname, pathname } = (urlValue && new URL(urlValue)) || {});
    }
    catch (_a) {
    }
    if (hostname) {
        isExternal = hostname !== window.location.host;
    }
    return { isExternal, hostname, pathname };
}
exports.getUrlData = getUrlData;
//# sourceMappingURL=utility.js.map