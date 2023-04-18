"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../dist");
const storage_1 = require("../src/storage");
describe('storage', () => {
    describe('safeStorageFactory', () => {
        it('uses sessionStorage when available', () => {
            const safeSessionStorage = (0, storage_1.safeStorageFactory)('sessionStorage', storage_1.MemoryStorage);
            expect(safeSessionStorage).toEqual(sessionStorage);
        });
        it('uses localStorage when available', () => {
            const safeLocalStorage = (0, storage_1.safeStorageFactory)('localStorage', storage_1.MemoryStorage);
            expect(safeLocalStorage).toEqual(localStorage);
        });
        describe('when localStorage is not available', () => {
            let storageSpy;
            beforeEach(() => {
                storageSpy = jest.spyOn(window, "localStorage", "get");
                storageSpy.mockImplementation(() => undefined);
            });
            afterEach(() => {
                storageSpy.mockRestore();
            });
            it('uses provided storage', () => {
                const safeLocalStorage = (0, storage_1.safeStorageFactory)('localStorage', storage_1.MemoryStorage);
                expect(safeLocalStorage).toBeInstanceOf(storage_1.MemoryStorage);
            });
        });
    });
    describe('MemoryStorage', () => {
        beforeEach(() => {
            localStorage.clear();
        });
        it('stores KVs like localStorage', () => {
            const memoryStorage = new storage_1.MemoryStorage();
            memoryStorage.setItem('foo', 'bar');
            localStorage.setItem('foo', 'bar');
            expect(localStorage.getItem('foo'))
                .toEqual(memoryStorage.getItem('foo'));
            expect(localStorage.length)
                .toEqual(memoryStorage.length);
            memoryStorage.removeItem('foo');
            localStorage.removeItem('foo');
            expect(localStorage.getItem('foo'))
                .toEqual(memoryStorage.getItem('foo'));
            expect(localStorage.length)
                .toEqual(memoryStorage.length);
            expect(localStorage.key(0))
                .toEqual(memoryStorage.key(0));
        });
    });
    describe('hasStorage', () => {
        it('if localStorage is available it returns true', () => {
            expect((0, storage_1.hasStorage)('localStorage')).toBe(true);
        });
        describe('when localStorage is not available', () => {
            let storageSpy;
            beforeEach(() => {
                storageSpy = jest.spyOn(window, "localStorage", "get");
                storageSpy.mockImplementation(() => undefined);
            });
            afterEach(() => {
                storageSpy.mockRestore();
            });
            it('it returns false', () => {
                expect((0, storage_1.hasStorage)('localStorage')).toBe(false);
            });
        });
    });
    describe('isStorageClassSupported', () => {
        it('if localStorage is available it returns true', () => {
            expect((0, dist_1.isStorageClassSupported)(localStorage)).toBe(true);
        });
        describe('when localStorage throws an error', () => {
            let getSpy;
            beforeEach(() => {
                getSpy = jest.spyOn(Storage.prototype, 'getItem');
                getSpy.mockImplementation(() => {
                    throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
                });
            });
            afterEach(() => {
                getSpy.mockRestore();
            });
            it('it returns false', () => {
                expect((0, dist_1.isStorageClassSupported)(localStorage)).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=storage.test.js.map