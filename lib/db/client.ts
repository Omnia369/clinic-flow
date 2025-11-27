import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// Lightweight promisified wrapper around sqlite3 for server-side API routes
export type PromisedDB = sqlite3.Database & {
  runAsync: (sql: string, params?: any[]) => Promise<{ lastID?: number; changes?: number }>;
  getAsync: <T = any>(sql: string, params?: any[]) => Promise<T | undefined>;
  allAsync: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
};

let dbPromise: Promise<PromisedDB> | null = null;

export async function getDb(): Promise<PromisedDB> {
  if (!dbPromise) {
    dbPromise = new Promise<PromisedDB>((resolve, reject) => {
      try {
        const dataDir = path.resolve(process.cwd(), 'data');
        fs.mkdirSync(dataDir, { recursive: true });
        const dbPath = path.join(dataDir, 'clinicflow.sqlite');
        const db = new sqlite3.Database(dbPath, (err) => {
          if (err) return reject(err);
          const runAsync = (sql: string, params: any[] = []) => new Promise<{ lastID?: number; changes?: number }>((res, rej) =>
            db.run(sql, params, function (this: any, err2: any) {
              if (err2) return rej(err2);
              res({ lastID: this.lastID, changes: this.changes });
            })
          );
          const getAsync = <T = any>(sql: string, params: any[] = []) => new Promise<T | undefined>((res, rej) =>
            db.get(sql, params, (err2, row) => (err2 ? rej(err2) : res(row as T)))
          );
          const allAsync = <T = any>(sql: string, params: any[] = []) => new Promise<T[]>((res, rej) =>
            db.all(sql, params, (err2, rows) => (err2 ? rej(err2) : res(rows as T[])))
          );
          const wrapped = db as PromisedDB;
          wrapped.runAsync = runAsync;
          wrapped.getAsync = getAsync;
          wrapped.allAsync = allAsync;
          resolve(wrapped);
        });
      } catch (e) {
        reject(e);
      }
    }).then(async (db) => {
      // Pragmas and schema
      await db.runAsync('PRAGMA journal_mode = WAL;');
      await db.runAsync(`CREATE TABLE IF NOT EXISTS captured_webhooks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT,
        ts TEXT DEFAULT CURRENT_TIMESTAMP,
        headers TEXT,
        raw_body TEXT,
        parsed_body TEXT,
        verify_result TEXT,
        alert_name TEXT,
        note TEXT,
        last_status INTEGER,
        idempotency_key TEXT
      )`);
      await db.runAsync('CREATE UNIQUE INDEX IF NOT EXISTS idx_captured_webhooks_idem ON captured_webhooks(idempotency_key)');
      return db;
    });
  }
  return dbPromise;
}

export async function closeDb(): Promise<void> {
  if (!dbPromise) return;
  const db = await dbPromise;
  await new Promise<void>((resolve) => db.close(() => resolve()));
  dbPromise = null;
}
