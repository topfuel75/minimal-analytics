type StorageClassName = 'localStorage' | 'sessionStorage';
declare function getRootObject(): Window | undefined;
declare function hasStorage(name: StorageClassName): boolean;
declare function isStorageClassSupported(storageInstance: Storage): boolean;
declare class MemoryStorage implements Storage {
    #private;
    constructor();
    clear(): void;
    key(index: number): string | null;
    getItem(name: string): string | null;
    setItem(name: string, value: string): void;
    removeItem(name: string): void;
    get length(): number;
}
declare function safeStorageFactory<T extends Storage>(storageClassName: StorageClassName, defaultStorageClass?: new () => T): Storage;
export { getRootObject, MemoryStorage, safeStorageFactory, hasStorage, isStorageClassSupported, };
