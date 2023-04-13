type StorageClassName = 'localStorage' | 'sessionStorage';

function getRootObject(): Window | undefined {
   if (typeof self === 'object') {
      return self;
   } else if (typeof window === 'object') {
      return window;
   }
}

function hasStorage(name: StorageClassName): boolean {
   const root = getRootObject();
   return (root && typeof root[name] !== 'undefined');
}

function isStorageClassSupported(storageInstance: Storage) {
   try {
     const testKey = "___storage_test___";
     storageInstance.setItem(testKey, testKey);
     const testValue = storageInstance.getItem(testKey);
     storageInstance.removeItem(testKey);
     return (testKey === testValue);
   } catch (e) {
     return false; // i.e. QUOTA_EXCEEDED_ERR
   }
}

class MemoryStorage implements Storage {
   #map: Map<string, string>;

   constructor() {
      this.clear();
   }

   clear() {
      this.#map = new Map();
   }

   key(index: number): string | null {
      return this.#map.values()[index] || null;
   }

   getItem(name: string): string | null {
      return this.#map.get(name) || null;
   }

   setItem(name: string, value: string): void {
      this.#map.set(name, value);
   }

   removeItem(name: string): void {
      this.#map.delete(name);
   }

   get length(): number {
      return this.#map.size;
   }
}

function safeStorageFactory<T extends Storage>(storageClassName: StorageClassName, defaultStorageClass?: new () => T): Storage {
   const hasStorageClass = hasStorage(storageClassName);
   if (!hasStorageClass) {
      return new defaultStorageClass();
   }

   const root = getRootObject();
   const storageInstance = root[storageClassName];
   const storageClassSupported = isStorageClassSupported(storageInstance);
   if (!storageClassSupported) {
      return new defaultStorageClass();
   }

   return storageInstance;
}

export {
   getRootObject,
   MemoryStorage,
   safeStorageFactory,
   hasStorage,
   isStorageClassSupported,
};