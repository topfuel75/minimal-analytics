"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.track = void 0;
const shared_1 = require("@minimal-analytics/shared");
const shared_2 = require("@minimal-analytics/shared");
const model_1 = require("./model");
const root = (0, shared_1.getRootObject)();
const isBrowser = typeof window !== 'undefined';
const defineGlobal = isBrowser && ((_a = root === null || root === void 0 ? void 0 : root.minimalAnalytics) === null || _a === void 0 ? void 0 : _a.defineGlobal);
const autoTrack = isBrowser && ((_b = root === null || root === void 0 ? void 0 : root.minimalAnalytics) === null || _b === void 0 ? void 0 : _b.autoTrack);
const analyticsEndpoint = 'https://www.google-analytics.com/g/collect';
const searchTerms = ['q', 's', 'search', 'query', 'keyword'];
const clickTargets = 'a, button, input[type=submit], input[type=button]';
let clickHandler;
let scrollHandler;
let unloadHandler;
let engagementTimes = [[Date.now()]];
let trackCalled = false;
const eventKeys = {
    pageView: 'page_view',
    scroll: 'scroll',
    click: 'click',
    viewSearchResults: 'view_search_results',
    userEngagement: 'user_engagement',
    fileDownload: 'file_download',
};
function merge(eventParamsA, eventParamsB) {
    const paramMapA = new Map(eventParamsA);
    const paramMapB = new Map(eventParamsB);
    const mergedEventParams = new Map([...paramMapA, ...paramMapB]);
    return Array.from(mergedEventParams.entries());
}
function getArguments(args) {
    var _a;
    const globalId = (_a = root === null || root === void 0 ? void 0 : root.minimalAnalytics) === null || _a === void 0 ? void 0 : _a.trackingId;
    const trackingId = typeof args[0] === 'string' ? args[0] : globalId;
    const props = typeof args[0] === 'object' ? args[0] : args[1] || {};
    return [trackingId, { type: eventKeys.pageView, ...props }];
}
function getEventMeta({ type = '', event }) {
    var _a, _b, _c;
    const searchString = ((_b = (_a = root === null || root === void 0 ? void 0 : root.document) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.search) || ((_c = root === null || root === void 0 ? void 0 : root.location) === null || _c === void 0 ? void 0 : _c.search) || '';
    const searchParams = new URLSearchParams(searchString);
    const searchResults = searchTerms.some((term) => new RegExp(`[\?|&]${term}=`, 'g').test(searchString));
    const eventName = searchResults ? eventKeys.viewSearchResults : type;
    const searchTerm = searchTerms.find((term) => searchParams.get(term));
    let eventParams = [
        [model_1.param.eventName, eventName],
        [`${model_1.param.eventParam}.search_term`, searchTerm || ''],
    ];
    if (event) {
        eventParams = merge(eventParams, (0, shared_1.getEventParams)(event));
    }
    return eventParams;
}
function getQueryParams(trackingId, { type, event, debug }) {
    const { location, referrer, title } = (0, shared_1.getDocument)();
    const { firstVisit, sessionStart, sessionCount } = (0, shared_1.getSessionState)(!trackCalled);
    const screen = self.screen || {};
    let params = [
        [model_1.param.protocolVersion, '2'],
        [model_1.param.trackingId, trackingId],
        [model_1.param.pageId, (0, shared_1.getRandomId)()],
        [model_1.param.language, (navigator.language || '').toLowerCase()],
        [model_1.param.clientId, (0, shared_1.getClientId)()],
        [model_1.param.firstVisit, firstVisit],
        [model_1.param.hitCount, '1'],
        [model_1.param.sessionId, (0, shared_1.getSessionId)()],
        [model_1.param.sessionCount, sessionCount],
        [model_1.param.sessionEngagement, '1'],
        [model_1.param.sessionStart, sessionStart],
        [model_1.param.debug, debug ? '1' : ''],
        [model_1.param.referrer, referrer],
        [model_1.param.location, location],
        [model_1.param.title, title],
        [model_1.param.screenResolution, `${screen.width}x${screen.height}`],
    ];
    params = merge(params, getEventMeta({ type, event }));
    params = params.filter(([, value]) => value);
    return new URLSearchParams(params);
}
function getActiveTime() {
    const timeActive = engagementTimes
        .reduce((result, [visible, hidden = Date.now()]) => (result += hidden - visible), 0)
        .toString();
    return timeActive;
}
function onClickEvent(trackingId, event) {
    var _a, _b, _c, _d;
    const targetElement = (0, shared_1.isTargetElement)(event.target, clickTargets);
    const tagName = (_a = targetElement === null || targetElement === void 0 ? void 0 : targetElement.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const elementType = tagName === 'a' ? 'link' : tagName;
    const hrefAttr = (targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute('href')) || void 0;
    const downloadAttr = (targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute('download')) || void 0;
    const fileUrl = downloadAttr || hrefAttr;
    const { isExternal, hostname, pathname } = (0, shared_1.getUrlData)(fileUrl);
    const isInternalLink = elementType === 'link' && !isExternal;
    const [fileExtension] = (fileUrl === null || fileUrl === void 0 ? void 0 : fileUrl.match(new RegExp(model_1.files.join('|'), 'g'))) || [];
    const eventName = fileExtension ? eventKeys.fileDownload : eventKeys.click;
    const elementParam = `${model_1.param.eventParam}.${elementType}`;
    if (!targetElement || (isInternalLink && !fileExtension)) {
        return;
    }
    let eventParams = [
        [`${elementParam}_id`, targetElement.id],
        [`${elementParam}_classes`, targetElement.className],
        [`${elementParam}_name`, (_b = targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute('name')) === null || _b === void 0 ? void 0 : _b.trim()],
        [`${elementParam}_text`, (_c = targetElement.textContent) === null || _c === void 0 ? void 0 : _c.trim()],
        [`${elementParam}_value`, (_d = targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute('value')) === null || _d === void 0 ? void 0 : _d.trim()],
        [`${elementParam}_url`, hrefAttr],
        [`${elementParam}_domain`, hostname],
        [`${model_1.param.eventParam}.outbound`, `${isExternal}`],
        [model_1.param.enagementTime, getActiveTime()],
    ];
    if (fileExtension) {
        eventParams = eventParams.concat([
            [`${model_1.param.eventParam}.file_name`, pathname || fileUrl],
            [`${model_1.param.eventParam}.file_extension`, fileExtension],
        ]);
    }
    track(trackingId, {
        type: eventName,
        event: eventParams,
    });
}
function onBlurEvent() {
    const timeIndex = engagementTimes.length - 1;
    const [, isHidden] = engagementTimes[timeIndex];
    if (!isHidden) {
        engagementTimes[timeIndex].push(Date.now());
    }
}
function onFocusEvent() {
    const timeIndex = engagementTimes.length - 1;
    const [, isHidden] = engagementTimes[timeIndex];
    if (isHidden) {
        engagementTimes.push([Date.now()]);
    }
}
function onVisibilityChange() {
    var _a;
    const timeIndex = engagementTimes.length - 1;
    const [, isHidden] = engagementTimes[timeIndex];
    const stateIndex = ['hidden', 'visible'].indexOf(((_a = root === null || root === void 0 ? void 0 : root.document) === null || _a === void 0 ? void 0 : _a.visibilityState) || '');
    const isVisible = Boolean(stateIndex);
    if (stateIndex === -1) {
        return;
    }
    if (!isVisible) {
        !isHidden && engagementTimes[timeIndex].push(Date.now());
        return;
    }
    isHidden && engagementTimes.push([Date.now()]);
}
const onScrollEvent = (0, shared_1.debounce)((trackingId) => {
    var _a;
    const percentage = (0, shared_1.getScrollPercentage)();
    if (percentage < 90) {
        return;
    }
    const eventParams = [[`${model_1.param.eventParamNumber}.percent_scrolled`, 90]];
    track(trackingId, {
        type: eventKeys.scroll,
        event: eventParams,
    });
    (_a = root === null || root === void 0 ? void 0 : root.document) === null || _a === void 0 ? void 0 : _a.removeEventListener('scroll', scrollHandler);
});
function onUnloadEvent(trackingId) {
    const eventParams = [[model_1.param.enagementTime, getActiveTime()]];
    track(trackingId, {
        type: eventKeys.userEngagement,
        event: eventParams,
    });
}
function bindEvents(trackingId) {
    var _a, _b, _c;
    if (trackCalled) {
        return;
    }
    clickHandler = onClickEvent.bind(null, trackingId);
    scrollHandler = onScrollEvent.bind(null, trackingId);
    unloadHandler = onUnloadEvent.bind(null, trackingId);
    (_a = root === null || root === void 0 ? void 0 : root.document) === null || _a === void 0 ? void 0 : _a.addEventListener('visibilitychange', onVisibilityChange);
    (_b = root === null || root === void 0 ? void 0 : root.document) === null || _b === void 0 ? void 0 : _b.addEventListener('scroll', scrollHandler);
    (_c = root === null || root === void 0 ? void 0 : root.document) === null || _c === void 0 ? void 0 : _c.addEventListener('click', clickHandler);
    root === null || root === void 0 ? void 0 : root.addEventListener('blur', onBlurEvent);
    root === null || root === void 0 ? void 0 : root.addEventListener('focus', onFocusEvent);
    root === null || root === void 0 ? void 0 : root.addEventListener('beforeunload', unloadHandler);
}
function track(...args) {
    var _a;
    const [trackingId, { type, event, debug }] = getArguments(args);
    if (!trackingId) {
        console.error('GA4: Tracking ID is missing or undefined');
        return;
    }
    const queryParams = getQueryParams(trackingId, { type, event, debug });
    const endpoint = ((_a = root === null || root === void 0 ? void 0 : root.minimalAnalytics) === null || _a === void 0 ? void 0 : _a.analyticsEndpoint) || analyticsEndpoint;
    (0, shared_2.sendBeacon)(`${endpoint}?${queryParams}`);
    if (isBrowser) {
        bindEvents(trackingId);
    }
    trackCalled = true;
}
exports.track = track;
if (defineGlobal && root) {
    root.track = track;
}
if (autoTrack) {
    track();
}
//# sourceMappingURL=index.js.map