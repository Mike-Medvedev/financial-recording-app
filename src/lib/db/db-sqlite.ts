import * as SQLite from "expo-sqlite";
import type { Category, CategoryTotal, Transaction } from "./types";
import { getWeekRange } from "../week";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("expense_tracker.db");
      await runMigrations(db);
      return db;
    })();
  }
  return dbPromise;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
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

  const rows = await db.getAllAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM categories"
  );
  if (rows[0]?.count === 0) {
    await db.runAsync(
      "INSERT INTO categories (name, sort_order) VALUES (?, ?), (?, ?), (?, ?)",
      "Food",
      0,
      "Gas",
      1,
      "Luxury",
      2
    );
  }
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Category>(
    "SELECT id, name, sort_order FROM categories ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getCategoryTotalsForWeek(
  weekKey: string
): Promise<CategoryTotal[]> {
  const db = await getDb();
  const [, sunday] = getWeekRange(weekKey);
  const rows = await db.getAllAsync<{ category_id: number; total: number }>(
    `SELECT c.id as category_id, COALESCE(SUM(t.amount), 0) as total
     FROM categories c
     LEFT JOIN transactions t ON t.category_id = c.id AND t.date >= ? AND t.date <= ?
     GROUP BY c.id
     ORDER BY c.sort_order ASC, c.id ASC`,
    weekKey,
    sunday
  );
  return rows.map((r) => ({
    category_id: r.category_id,
    total: Number(r.total),
  }));
}

export async function getTransactionsByWeekAndDay(
  weekKey: string,
  date: string
): Promise<(Transaction & { category_name: string })[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Transaction & { category_name: string }>(
    `SELECT t.id, t.date, t.category_id, t.amount, t.created_at, c.name as category_name
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.date = ?
     ORDER BY t.created_at ASC`,
    date
  );
  return rows;
}

export async function insertTransaction(params: {
  date: string;
  categoryId: number;
  amount: number;
}): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO transactions (date, category_id, amount) VALUES (?, ?, ?)",
    params.date,
    params.categoryId,
    params.amount
  );
  return result.lastInsertRowId;
}

export async function insertCategory(name: string): Promise<number> {
  const db = await getDb();
  const maxOrder = await db.getFirstAsync<{ max: number | null }>(
    "SELECT MAX(sort_order) as max FROM categories"
  );
  const sortOrder = (maxOrder?.max ?? -1) + 1;
  const result = await db.runAsync(
    "INSERT INTO categories (name, sort_order) VALUES (?, ?)",
    name,
    sortOrder
  );
  return result.lastInsertRowId;
}
