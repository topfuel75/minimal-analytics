"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../src/utility");
const hashSeed = `${Math.random()}`;
const testPath = '/test/path';
const testExternalHost = 'www.google.com';
const testLocalHost = 'localhost';
const testExternalUrl = `https://${testExternalHost + testPath}`;
const testLocalUrl = `http://${testLocalHost}:3000${testPath}`;
describe('shared -> utility', () => {
    describe('getRandomId', () => {
        it('generates a unique ID after every call', () => {
            const results = [...Array(10).keys()].map(() => (0, utility_1.getRandomId)());
            results.forEach((result) => {
                expect(result).not.toEqual((0, utility_1.getRandomId)());
            });
        });
        it('generates an ID of correct length', () => {
            const lengths = [8, 12, 16];
            lengths.forEach((length) => {
                expect((0, utility_1.getRandomId)(length).length).toEqual(length);
            });
        });
        it('limits character length to 16 digits', () => {
            const lengths = [32, 64, 128];
            lengths.forEach((length) => {
                expect((0, utility_1.getRandomId)(length).length).toEqual(16);
            });
        });
    });
    describe('getHash', () => {
        it('generates a hash string from an input seed', () => {
            const iterations = [...Array(10).keys()];
            const result = (0, utility_1.getHashId)(hashSeed);
            expect(result).not.toEqual(hashSeed);
            iterations.forEach(() => {
                expect(result).toEqual((0, utility_1.getHashId)(hashSeed));
            });
        });
        it('generates a hash of correct length', () => {
            const lengths = [8, 16, 32, 64];
            lengths.forEach((length) => {
                expect((0, utility_1.getHashId)(hashSeed, length).length).toEqual(length);
            });
        });
    });
    describe('isTargetElement', () => {
        it('returns element if matched by provided selector', () => {
            const target = document.createElement('a');
            const selector = 'a';
            const result = (0, utility_1.isTargetElement)(target, selector);
            expect(result).not.toBe(null);
            expect(result === null || result === void 0 ? void 0 : result.tagName.toLowerCase()).toBe(selector);
        });
        it('returns element if matched in parent tree by selector', () => {
            const wrapper = document.createElement('section');
            const html = `<a href="#"><div><span>Link</span></div></a>`;
            const selector = 'a';
            wrapper.innerHTML = html;
            const target = wrapper.querySelector('span');
            const result = (0, utility_1.isTargetElement)(target, selector);
            expect(result).not.toBe(null);
            expect(result === null || result === void 0 ? void 0 : result.tagName.toLowerCase()).toBe(selector);
        });
        it('returns null if element does not match selector', () => {
            const wrapper = document.createElement('section');
            const html = `<a href="#"><div><span>Link</span></div></a>`;
            const selector = 'button';
            wrapper.innerHTML = html;
            const target = wrapper.querySelector('span');
            const result = (0, utility_1.isTargetElement)(target, selector);
            expect(result).toBe(null);
            expect(result === null || result === void 0 ? void 0 : result.tagName.toLowerCase()).not.toBe(selector);
        });
    });
    describe('getUrlData', () => {
        it('returns correct data from an external URL', () => {
            const result = (0, utility_1.getUrlData)(testExternalUrl);
            expect(result).toEqual({
                isExternal: true,
                hostname: testExternalHost,
                pathname: testPath,
            });
        });
        it('returns correct data from a local URL', () => {
            const result = (0, utility_1.getUrlData)(testLocalUrl);
            expect(result).toEqual({
                isExternal: false,
                hostname: testLocalHost,
                pathname: testPath,
            });
        });
        it('handles an invalid URL being passed', () => {
            const result = (0, utility_1.getUrlData)(hashSeed);
            expect(result).toEqual({ isExternal: false });
        });
    });
});
//# sourceMappingURL=utility.test.js.map