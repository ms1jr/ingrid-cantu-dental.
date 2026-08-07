const DB_NAME = 'ic-dental-db';
const DB_VERSION = 2;
const STORES = ['patients', 'appointments', 'treatments', 'prescriptions'];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = fn(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  });
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const db = {
  uid,
  async getAll(storeName) {
    const db_ = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db_.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },
  async put(storeName, record) {
    await withStore(storeName, 'readwrite', (store) => store.put(record));
    return record;
  },
  async remove(storeName, id) {
    await withStore(storeName, 'readwrite', (store) => store.delete(id));
  },
};
