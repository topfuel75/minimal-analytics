"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.track = void 0;
const shared_1 = require("@minimal-analytics/shared");
const model_1 = require("./model");
const isBrowser = typeof window !== 'undefined';
const autoTrack = isBrowser && ((_a = window.minimalAnalytics) === null || _a === void 0 ? void 0 : _a.autoTrack);
const analyticsEndpoint = 'https://heapanalytics.com/h';
const textLimit = 64;
const blockedTags = ['html', 'body'];
let eventsBound = false;
let clickHandler = null;
let eventCounter = 0;
function getArguments(args) {
    var _a;
    const globalId = (_a = window.minimalAnalytics) === null || _a === void 0 ? void 0 : _a.trackingId;
    const trackingId = typeof args[0] === 'string' ? args[0] : globalId;
    const props = typeof args[0] === 'object' ? args[0] : args[1] || {};
    return [trackingId, { type: 'view', ...props }];
}
function getQueryParams(trackingId, { event }) {
    let payload = [
        [model_1.param.appId, trackingId],
        [model_1.param.version, '4.0'],
        [model_1.param.userId, (0, shared_1.getClientId)()],
        [model_1.param.sessionId, (0, shared_1.getSessionId)()],
        [model_1.param.viewId, (0, shared_1.getRandomId)()],
        [model_1.param.sentTime, `${Date.now()}`],
        ['b', 'web'],
        ['sp', 'r'],
    ];
    payload = payload.concat(getPageData(!!event));
    payload = payload.concat(event ? event : []);
    payload.forEach(([, value], index) => value || delete payload[index]);
    return new URLSearchParams(payload);
}
function getPageData(isEvent) {
    const { hostname, referrer, title, pathname } = (0, shared_1.getDocument)();
    let payload = [
        [model_1.param.domain, hostname],
        [model_1.param.title, title],
        [model_1.param.path, pathname],
        [model_1.param.referrer, referrer],
        [model_1.param.previousPage, referrer],
        [model_1.param.timeStamp, `${Date.now()}`],
        ['z', '2'],
    ];
    if (isEvent) {
        payload = [].concat(...payload.map(([key, value]) => [
            [model_1.param.pageParam, key],
            [model_1.param.pageParam, value],
        ]));
    }
    return payload;
}
function getAttributeValue(attributes) {
    const { href } = Array.from(attributes || []).reduce((result, { name, value }) => ({
        ...result,
        [name]: value,
    }), {});
    let result = '';
    if (href) {
        result = `[href=${href}];`;
    }
    return result;
}
function getClassList(className) {
    return !className ? className : `.${className.split(' ').join(';.')};`;
}
function getTagName(element) {
    var _a;
    return (element.tagName || ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.tagName)).toLowerCase();
}
function getElementHierachy(path) {
    const nodePath = path.reverse().filter(({ tagName }) => {
        return !!tagName && !blockedTags.includes(tagName.toLowerCase());
    });
    const getHeirachy = (element) => [
        `@${getTagName(element)};`,
        getClassList(element.className),
        getAttributeValue(element.attributes),
    ];
    return nodePath.reduce((result, element) => (result += `${getHeirachy(element).join('')}|`), '');
}
function getElementData(element) {
    const textContent = (element.textContent || '').substring(0, textLimit);
    const eventData = [
        [model_1.param.title, 'click'],
        [model_1.param.targetTag, getTagName(element)],
        [model_1.param.targetText, textContent],
        [model_1.param.targetClass, element.className],
        [model_1.param.path, element.href],
        [model_1.param.timeStamp, `${Date.now() - 5e2}`],
    ];
    return eventData;
}
function onClickEvent(trackingId, event) {
    const target = event.target;
    const eventData = getElementData(target);
    eventData.push([model_1.param.hierachy, getElementHierachy(event.path)]);
    track(trackingId, {
        type: 'click',
        event: eventData.map(([param, value]) => [param + eventCounter, value]),
    });
    eventCounter += 1;
}
function bindEvents(trackingId) {
    if (eventsBound) {
        return;
    }
    eventsBound = true;
    clickHandler = onClickEvent.bind(null, trackingId);
    document.addEventListener('click', clickHandler);
}
function track(...args) {
    const [trackingId, { type, event }] = getArguments(args);
    if (!trackingId) {
        console.error('Heap: Tracking ID is missing or undefined');
        return;
    }
    const queryParams = getQueryParams(trackingId, { type, event });
    window.fetch(`${analyticsEndpoint}?${queryParams}`, {
        mode: 'no-cors',
    });
    bindEvents(trackingId);
}
exports.track = track;
if (autoTrack) {
    track((_b = window.minimalAnalytics) === null || _b === void 0 ? void 0 : _b.trackingId);
}
//# sourceMappingURL=index.js.map