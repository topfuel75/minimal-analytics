"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const values_1 = require("../src/values");
const testHost = 'localhost';
const testTitle = 'testTitle';
const testKey = 'testKey';
const testClientId = '1234509876';
const testQuery1 = 'testQuery1';
const testQuery2 = 'testQuery2';
const testStringValue = `testValue-${Math.random()}`;
const testNumberValue = Math.random();
jest.mock('../src/utility', () => ({
    getRandomId: jest.fn(() => testClientId),
}));
describe('shared -> values', () => {
    describe('getDocument', () => {
        document.title = testTitle;
        it('returns the correct properties and values', () => {
            const result = (0, values_1.getDocument)();
            expect(result).toEqual({
                hostname: testHost,
                title: testTitle,
                location: `http://${testHost}/`,
                pathname: '/',
                referrer: '',
            });
        });
        describe('when document is not available', () => {
            let documentSpy;
            beforeEach(() => {
                documentSpy = jest.spyOn(window, "document", "get");
                documentSpy.mockImplementation(() => undefined);
            });
            afterEach(() => {
                documentSpy.mockClear();
            });
            it('returns when document is not available', () => {
                const result = (0, values_1.getDocument)();
                expect(result).toEqual({
                    hostname: testHost,
                    title: undefined,
                    location: `http://${testHost}/`,
                    pathname: '/',
                    referrer: undefined,
                });
            });
        });
    });
    describe('getClientId', () => {
        let getSpy;
        let setSpy;
        beforeEach(() => {
            getSpy = jest.spyOn(Storage.prototype, 'getItem');
            setSpy = jest.spyOn(Storage.prototype, 'setItem');
        });
        afterEach(() => {
            getSpy.mockClear();
            setSpy.mockClear();
        });
        it('generates and defines a clientId in localStorage if not set', () => {
            const result = (0, values_1.getClientId)(testKey);
            expect(result).toEqual(testClientId);
            expect(getSpy).toBeCalledWith(testKey);
            expect(setSpy).toBeCalledWith(testKey, result);
        });
        it('returns a previously defined clientId if in localStorage', () => {
            getSpy.mockReturnValue(testClientId);
            const result = (0, values_1.getClientId)(testKey);
            expect(result).toEqual(testClientId);
            expect(getSpy).toBeCalledWith(testKey);
            expect(setSpy).not.toBeCalledWith(testKey, result);
        });
        describe('when localStorage is not available', () => {
            let storageSpy;
            let warnSpy;
            jest.resetModules();
            const getClientIdCopy = require('../src/values').getClientId;
            beforeEach(() => {
                warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
                storageSpy = jest.spyOn(window, "localStorage", "get");
                storageSpy.mockImplementation(() => undefined);
                getSpy.mockReturnValue(null);
            });
            afterEach(() => {
                storageSpy.mockRestore();
            });
            it('warns via a console statement', () => {
                getClientIdCopy(testKey);
                expect(warnSpy).toHaveBeenCalled();
            });
            it('generates a new clientId', () => {
                getClientIdCopy(testKey);
                getClientIdCopy(testKey);
                expect(getSpy).toHaveBeenCalledTimes(2);
                expect(setSpy).toHaveBeenCalledTimes(2);
                expect(getSpy).toBeCalledWith(testKey);
            });
        });
    });
    describe('getEventParams', () => {
        it('returns a multidimensional array of strings from an input object', () => {
            const event = { [testQuery1]: testStringValue, [testQuery2]: testNumberValue };
            const result = (0, values_1.getEventParams)(event);
            expect(result).toEqual([
                [testQuery1, testStringValue],
                [testQuery2, `${testNumberValue}`],
            ]);
        });
        it('returns input if already a multidimensional array and casts to string', () => {
            const event = [
                [testQuery1, testStringValue],
                [testQuery2, testNumberValue],
            ];
            const result = (0, values_1.getEventParams)(event);
            expect(result).toEqual(event.map((items) => items.map((item) => item === null || item === void 0 ? void 0 : item.toString())));
        });
    });
    describe('getSessionState', () => {
        beforeEach(() => {
            sessionStorage.clear();
        });
        it('correctly sets firstVisit, sessionStart, and sessionCount after multiple calls', () => {
            let state = (0, values_1.getSessionState)(true);
            expect(state.firstVisit).toEqual('1');
            expect(state.sessionStart).toEqual('1');
            expect(state.sessionCount).toEqual('1');
            state = (0, values_1.getSessionState)(false);
            (0, values_1.getSessionId)();
            expect(state.firstVisit).toBeUndefined;
            expect(state.sessionStart).toBeUndefined;
            expect(state.sessionCount).toEqual('1');
        });
        it('correctly sets firstVisit after clientId is set', () => {
            let state = (0, values_1.getSessionState)(true);
            expect(state.firstVisit).toEqual('1');
            (0, values_1.getClientId)();
            state = (0, values_1.getSessionState)(true);
            expect(state.firstVisit).toBeUndefined;
        });
        it('correctly sets firstVisit after clientId is set directly', () => {
            localStorage.setItem('clientId', testClientId);
            const state = (0, values_1.getSessionState)(true);
            expect(state.firstVisit).toBeUndefined;
        });
    });
    describe('getSessionId', () => {
        let getSpy;
        let setSpy;
        beforeEach(() => {
            sessionStorage.clear();
            getSpy = jest.spyOn(Storage.prototype, 'getItem');
            setSpy = jest.spyOn(Storage.prototype, 'setItem');
        });
        afterEach(() => {
            getSpy.mockClear();
            setSpy.mockClear();
        });
        it('returns the same id after multiple calls', () => {
            const id1 = (0, values_1.getSessionId)();
            const id2 = (0, values_1.getSessionId)();
            expect(id1).toEqual(testClientId);
            expect(id1).toEqual(id2);
            expect(getSpy).toBeCalledWith(values_1.sessionKey);
            expect(setSpy).toBeCalledWith(values_1.sessionKey, testClientId);
        });
    });
});
//# sourceMappingURL=values.test.js.map