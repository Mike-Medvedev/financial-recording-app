import type * as SQLite from 'expo-sqlite';

const DEFAULT_CATEGORIES = ['Food', 'Gas', 'Luxury', 'Bills', 'Other'];

export async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
  `);

  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );

  if (existing?.count === 0) {
    for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
      await db.runAsync(
        'INSERT INTO categories (name, sort_order) VALUES (?, ?)',
        DEFAULT_CATEGORIES[i],
        i
      );
    }
  }
}
