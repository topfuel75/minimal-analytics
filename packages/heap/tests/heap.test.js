"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const model_1 = require("../src/model");
const trackingId = 'GX-XXXXX';
const analyticsEndpoint = 'https://heapanalytics.com/h';
const errorTrackingId = 'Heap: Tracking ID is missing or undefined';
const testDomain = 'localhost';
const testPath = '/';
const testReferrer = 'https://google.com';
const testTitle = 'testTitle';
const fetchOptions = { mode: 'no-cors' };
const testLink = 'https://google.com';
const testClass = 'testClass';
const testAnchor = `
  <section id="article">
    <main class="${testClass} ${testClass}">
      <a href="${testLink}" class="${testClass}">${testTitle}</a>
    </main>
  </section>
`;
const sleep = (time = 1) => new Promise((resolve) => setTimeout(resolve, time * 1000));
function getElementPath(element) {
    let result = [element];
    let parent = element.parentElement;
    while (parent && parent.tagName !== 'BODY') {
        result.push(parent);
        parent = parent.parentElement;
    }
    return result;
}
Object.defineProperty(window, 'fetch', { value: jest.fn() });
describe('heap -> track()', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    Object.defineProperties(document, {
        referrer: {
            value: testReferrer,
        },
        title: {
            value: testTitle,
        },
    });
    let root;
    beforeEach(() => {
        jest.resetAllMocks();
        root = document.createElement('div');
        document.body.appendChild(root);
    });
    afterEach(() => {
        document.body.removeChild(root);
    });
    it('logs an error message if no tracking ID is provided', () => {
        (0, index_1.track)();
        expect(errorSpy).toHaveBeenCalledWith(errorTrackingId);
        expect(window.fetch).not.toBeCalled();
    });
    it('can be called directly with a tracking ID', () => {
        (0, index_1.track)(trackingId);
        expect(window.fetch).toBeCalledTimes(1);
    });
    it('defines the correct query params when sending a default page view request', () => {
        const params = [
            analyticsEndpoint,
            `a=${trackingId}`,
            `d=${testDomain}`,
            `h=${encodeURIComponent(testPath)}`,
            `r=${encodeURIComponent(testReferrer)}`,
            `t=${testTitle}`,
        ];
        (0, index_1.track)(trackingId);
        expect(window.fetch).toBeCalledTimes(1);
        params.forEach((param) => expect(window.fetch).toBeCalledWith(expect.stringContaining(param), fetchOptions));
    });
    it('defines the correct query params when sending a click event request', () => {
        const params = [
            analyticsEndpoint,
            `${model_1.param.appId}=${trackingId}`,
            `${model_1.param.pageParam}=${model_1.param.domain}`,
            `${model_1.param.pageParam}=${testDomain}`,
            `${model_1.param.pageParam}=${model_1.param.path}`,
            `${model_1.param.pageParam}=${encodeURIComponent(testPath)}`,
            `${model_1.param.pageParam}=${model_1.param.referrer}`,
            `${model_1.param.pageParam}=${encodeURIComponent(testReferrer)}`,
            `${model_1.param.title}0=click`,
            `${model_1.param.targetTag}0=a`,
            `${model_1.param.targetText}0=${testTitle}`,
            `${model_1.param.targetClass}0=${testClass}`,
        ];
        root.innerHTML = testAnchor;
        (0, index_1.track)(trackingId);
        const link = root.querySelector('a');
        const event = new CustomEvent('click');
        Object.defineProperty(event, 'target', { value: link });
        Object.defineProperty(event, 'path', { value: getElementPath(link) });
        document.dispatchEvent(event);
        expect(window.fetch).toBeCalledTimes(2);
        params.forEach((param) => expect(window.fetch).nthCalledWith(2, expect.stringContaining(param), fetchOptions));
    });
});
//# sourceMappingURL=heap.test.js.map