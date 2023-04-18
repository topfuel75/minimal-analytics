"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const beacon = __importStar(require("../src/beacon"));
const analyticsEndpoint = 'https://www.google-analytics.com/g/collect';
const xhrMock = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    readyState: 4,
    status: 200,
    response: 'OK'
};
describe('shared -> beacon', () => {
    const originalFetch = global.fetch;
    const fetchMock = jest.fn();
    beforeEach(() => {
        jest.spyOn(window, 'XMLHttpRequest')
            .mockImplementation(() => xhrMock);
        global.fetch = fetchMock;
        fetchMock.mockImplementation(() => Promise.resolve(''));
    });
    afterEach(() => {
        global.fetch = originalFetch;
    });
    describe('sendBeaconXHR', () => {
        it('makes a POST request using XMLHttpRequest', () => {
            beacon.sendBeaconXHR(analyticsEndpoint);
            expect(xhrMock.open)
                .toBeCalledWith('POST', analyticsEndpoint, expect.anything());
        });
        it('returns true if no error is thrown', () => {
            const response = beacon.sendBeaconXHR(analyticsEndpoint);
            expect(response).toBe(true);
        });
        it('returns false if an error is thrown', () => {
            const throwXhrMock = {
                open: jest.fn(),
                send: jest.fn(() => { throw new Error('InvalidStateError'); }),
                setRequestHeader: jest.fn(),
                readyState: 4,
                status: 200,
                response: 'OK'
            };
            jest.spyOn(window, 'XMLHttpRequest')
                .mockImplementation(() => throwXhrMock);
            expect(() => {
                const response = beacon.sendBeaconXHR(analyticsEndpoint);
                expect(response).toBe(false);
            }).not.toThrow(Error);
        });
    });
    describe('sendBeaconFetch', () => {
        it('makes a POST request using fetch', () => {
            beacon.sendBeaconFetch(analyticsEndpoint);
            expect(fetch)
                .toBeCalledWith(analyticsEndpoint, expect.objectContaining({
                method: 'POST',
            }));
        });
        it('returns true if no error is thrown', () => {
            const response = beacon.sendBeaconFetch(analyticsEndpoint);
            expect(response).toBe(true);
        });
        it('returns false if an error is thrown', () => {
            fetchMock.mockImplementation(() => { throw new TypeError('Invalid header name.'); });
            expect(() => {
                const response = beacon.sendBeaconFetch(analyticsEndpoint);
                expect(response).toBe(false);
            }).not.toThrow(Error);
        });
    });
    describe('sendBeacon', () => {
        const originalSendBeacon = navigator.sendBeacon;
        const sendBeaconMock = jest.fn();
        beforeAll(() => {
            navigator.sendBeacon = sendBeaconMock;
        });
        afterAll(() => {
            navigator.sendBeacon = originalSendBeacon;
        });
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('uses navigator.sendBeacon if available', () => {
            beacon.sendBeacon(analyticsEndpoint);
            expect(navigator.sendBeacon)
                .toBeCalledWith(analyticsEndpoint);
        });
        describe('if navigator is not available', () => {
            const navigatorSpy = jest.spyOn(window, "navigator", "get");
            beforeEach(() => {
                navigatorSpy.mockImplementation(() => undefined);
            });
            afterEach(() => {
                navigatorSpy.mockRestore();
            });
            it('uses XMLHttpRequest', () => {
                beacon.sendBeacon(analyticsEndpoint);
                expect(sendBeaconMock)
                    .not.toBeCalled();
                expect(xhrMock.open)
                    .toBeCalledWith('POST', analyticsEndpoint, expect.anything());
            });
        });
        it('uses XMLHttpRequest if sendBeacon is not available', () => {
            Object.assign(navigator, {
                sendBeacon: undefined,
            });
            beacon.sendBeacon(analyticsEndpoint);
            expect(xhrMock.open)
                .toBeCalledWith('POST', analyticsEndpoint, expect.anything());
            expect(sendBeaconMock)
                .not.toBeCalled();
        });
        it('uses fetch if XMLHttpRequest is not available', () => {
            Object.assign(navigator, {
                sendBeacon: undefined,
            });
            Object.assign(window, {
                XMLHttpRequest: undefined,
            });
            beacon.sendBeacon(analyticsEndpoint);
            expect(fetch)
                .toBeCalledWith(analyticsEndpoint, expect.objectContaining({
                method: 'POST',
            }));
            expect(sendBeaconMock)
                .not.toBeCalled();
        });
    });
});
//# sourceMappingURL=beacon.test.js.map