import type { Category, CategoryTotal, Transaction } from "./types";
import { getWeekRange } from "../week";

const STORAGE_KEY_CATEGORIES = "expense_tracker_categories";
const STORAGE_KEY_TRANSACTIONS = "expense_tracker_transactions";

const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Food", sort_order: 0 },
  { name: "Gas", sort_order: 1 },
  { name: "Luxury", sort_order: 2 },
];

function getCategoriesStorage(): Category[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (!raw) {
    const initial: Category[] = DEFAULT_CATEGORIES.map((c, i) => ({
      ...c,
      id: i + 1,
    }));
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw);
}

function setCategoriesStorage(categories: Category[]): void {
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
}

function getTransactionsStorage(): (Transaction & { category_name?: string })[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  return raw ? JSON.parse(raw) : [];
}

function setTransactionsStorage(
  transactions: (Transaction & { category_name?: string })[]
): void {
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

export async function getCategories(): Promise<Category[]> {
  return Promise.resolve(getCategoriesStorage());
}

export async function getCategoryTotalsForWeek(
  weekKey: string
): Promise<CategoryTotal[]> {
  const categories = getCategoriesStorage();
  const transactions = getTransactionsStorage();
  const [, sunday] = getWeekRange(weekKey);

  const totals = new Map<number, number>();
  categories.forEach((c) => totals.set(c.id, 0));

  transactions.forEach((t) => {
    if (t.date >= weekKey && t.date <= sunday) {
      totals.set(t.category_id, (totals.get(t.category_id) ?? 0) + t.amount);
    }
  });

  return categories
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((c) => ({ category_id: c.id, total: totals.get(c.id) ?? 0 }));
}

export async function getTransactionsByWeekAndDay(
  weekKey: string,
  date: string
): Promise<(Transaction & { category_name: string })[]> {
  const categories = getCategoriesStorage();
  const transactions = getTransactionsStorage();
  const byName = new Map(categories.map((c) => [c.id, c.name]));

  return Promise.resolve(
    transactions
      .filter((t) => t.date === date)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((t) => ({
        ...t,
        category_name: byName.get(t.category_id) ?? "",
      }))
  );
}

export async function insertTransaction(params: {
  date: string;
  categoryId: number;
  amount: number;
}): Promise<number> {
  const transactions = getTransactionsStorage();
  const id =
    transactions.length === 0
      ? 1
      : Math.max(...transactions.map((t) => t.id)) + 1;
  const created_at = new Date().toISOString();
  transactions.push({
    id,
    date: params.date,
    category_id: params.categoryId,
    amount: params.amount,
    created_at,
  });
  setTransactionsStorage(transactions);
  return id;
}

export async function insertCategory(name: string): Promise<number> {
  const categories = getCategoriesStorage();
  const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order));
  const id =
    categories.length === 0
      ? 1
      : Math.max(...categories.map((c) => c.id)) + 1;
  categories.push({ id, name, sort_order: maxOrder + 1 });
  setCategoriesStorage(categories);
  return id;
}
