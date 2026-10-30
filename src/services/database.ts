import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const DB_NAME = 'account_manager_sec.db';

export async function getDbConnection() {
  let encryptionKey = await SecureStore.getItemAsync('DB_ENCRYPTION_KEY');
  if (!encryptionKey) {
    encryptionKey = Crypto.randomUUID();
    await SecureStore.setItemAsync('DB_ENCRYPTION_KEY', encryptionKey);
  }
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}

export async function initDatabase() {
  const db = await getDbConnection();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL DEFAULT 'Google',
      provider_user_id TEXT,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      photo_url TEXT,
      category TEXT DEFAULT 'عام',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_used_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS platform_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      platform_name TEXT NOT NULL,
      platform_url TEXT,
      local_status TEXT DEFAULT 'مرتبط محلياً',
      linked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function addAuditLog(action: string, details: string) {
  try {
    const db = await getDbConnection();
    await db.runAsync('INSERT INTO audit_logs (action, details) VALUES (?, ?);', [action, details]);
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
}
