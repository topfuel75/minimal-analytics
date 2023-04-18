"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.files = exports.param = void 0;
const param = {
    protocolVersion: 'v',
    trackingId: 'tid',
    pageId: '_p',
    language: 'ul',
    clientId: 'cid',
    firstVisit: '_fv',
    hitCount: '_s',
    sessionId: 'sid',
    sessionCount: 'sct',
    sessionEngagement: 'seg',
    sessionStart: '_ss',
    debug: '_dbg',
    referrer: 'dr',
    location: 'dl',
    title: 'dt',
    eventName: 'en',
    eventParam: 'ep',
    eventParamNumber: 'epn',
    screenResolution: 'sr',
    enagementTime: '_et',
};
exports.param = param;
const files = [
    'pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi',
    'mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma',
];
exports.files = files;
//# sourceMappingURL=model.js.map