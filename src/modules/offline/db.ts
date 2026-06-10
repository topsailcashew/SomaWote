/**
 * IndexedDB schema via idb wrapper.
 * Stores: curriculum lessons, pending assessment submissions, user config.
 */
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SomaWoteDB extends DBSchema {
  lessons: {
    key: string;
    value: { id: string; title: string; content: string; cachedAt: number };
  };
  assessmentQueue: {
    key: number;
    value: { studentId: string; payload: unknown; queuedAt: number };
    autoIncrement: true;
  };
  userConfig: {
    key: string;
    value: unknown;
  };
}

let _db: IDBPDatabase<SomaWoteDB> | null = null;

export async function db(): Promise<IDBPDatabase<SomaWoteDB>> {
  if (_db) return _db;
  _db = await openDB<SomaWoteDB>('somawote-v1', 1, {
    upgrade(db) {
      db.createObjectStore('lessons', { keyPath: 'id' });
      db.createObjectStore('assessmentQueue', { autoIncrement: true });
      db.createObjectStore('userConfig');
    },
  });
  return _db;
}
