import type * as SQLite from 'expo-sqlite';

import type {
  Category,
  CategoryTotal,
  TransactionWithCategory,
} from './types';

export function getCategories(db: SQLite.SQLiteDatabase) {
  return db.getAllAsync<Category>(
    'SELECT * FROM categories ORDER BY sort_order ASC'
  );
}

export function getCategoryTotalsForWeek(
  db: SQLite.SQLiteDatabase,
  startDate: string,
  endDate: string
) {
  return db.getAllAsync<CategoryTotal>(
    `SELECT category_id, COALESCE(SUM(amount), 0) as total
     FROM transactions
     WHERE date >= ? AND date <= ?
     GROUP BY category_id`,
    startDate,
    endDate
  );
}

export function getTransactionsForDay(
  db: SQLite.SQLiteDatabase,
  date: string
) {
  return db.getAllAsync<TransactionWithCategory>(
    `SELECT t.*, c.name as category_name
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.date = ?
     ORDER BY t.created_at DESC`,
    date
  );
}

export function insertTransaction(
  db: SQLite.SQLiteDatabase,
  date: string,
  categoryId: number,
  amount: number
) {
  return db.runAsync(
    'INSERT INTO transactions (date, category_id, amount) VALUES (?, ?, ?)',
    date,
    categoryId,
    amount
  );
}

export function insertCategory(db: SQLite.SQLiteDatabase, name: string) {
  return db.runAsync(
    `INSERT INTO categories (name, sort_order)
     VALUES (?, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM categories))`,
    name
  );
}

export function deleteTransaction(db: SQLite.SQLiteDatabase, id: number) {
  return db.runAsync('DELETE FROM transactions WHERE id = ?', id);
}
