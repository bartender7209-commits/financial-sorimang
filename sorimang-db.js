/* 금융소리망 5.0 · 브라우저 IndexedDB 저장소.
 * 실사용 고객정보 수집 금지. 이 저장소는 사용자의 브라우저 내에만 존재합니다.
 */
(function (root) {
  'use strict';
  const DB_NAME = 'financial-sorimang-v5-local';
  const STORE = 'sessions';
  const VERSION = 1;
  function open() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) return reject(new Error('이 브라우저는 IndexedDB를 사용할 수 없습니다.'));
      const req = root.indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('savedAt', 'savedAt', { unique: false });
          store.createIndex('source', 'source', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('DB 연결 실패'));
      req.onblocked = () => reject(new Error('다른 탭에서 데이터베이스를 사용 중입니다.'));
    });
  }
  async function execute(mode, action) {
    const db = await open();
    return new Promise((resolve, reject) => {
      let result;
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      try { result = action(store); }
      catch (error) { db.close(); reject(error); return; }
      let value;
      if (result && typeof result === 'object' && 'onsuccess' in result) {
        result.onsuccess = () => { value = result.result; };
        result.onerror = () => { /* tx.onerror surfaces failure */ };
      }
      tx.oncomplete = () => { db.close(); resolve(value); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('DB 거래 실패')); };
      tx.onabort = () => { db.close(); reject(tx.error || new Error('DB 거래 중단')); };
    });
  }
  function save(record) {
    if (!record || typeof record.id !== 'string' || !record.id) {
      return Promise.reject(new Error('잘못된 기록 식별자'));
    }
    return execute('readwrite', store => store.put(record));
  }
  async function all() {
    const rows = await execute('readonly', store => store.getAll());
    return (rows || []).sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
  }
  function remove(id) { return execute('readwrite', store => store.delete(id)); }
  function clear() { return execute('readwrite', store => store.clear()); }
  root.SorimangDB = Object.freeze({ save, all, remove, clear, DB_NAME });
})(typeof window !== 'undefined' ? window : globalThis);
