import { Platform } from "react-native";
import type { Category, CategoryTotal, Transaction } from "./types";

type DbModule = {
  getCategories: () => Promise<Category[]>;
  getCategoryTotalsForWeek: (weekKey: string) => Promise<CategoryTotal[]>;
  getTransactionsByWeekAndDay: (
    weekKey: string,
    date: string
  ) => Promise<(Transaction & { category_name: string })[]>;
  insertTransaction: (params: {
    date: string;
    categoryId: number;
    amount: number;
  }) => Promise<number>;
  insertCategory: (name: string) => Promise<number>;
};

let dbModule: DbModule | null = null;

async function getDb(): Promise<DbModule> {
  if (dbModule) return dbModule;
  if (Platform.OS === "web") {
    dbModule = await import("./db-web");
  } else {
    dbModule = await import("./db-sqlite");
  }
  return dbModule;
}

export async function getCategories(): Promise<Category[]> {
  return (await getDb()).getCategories();
}

export async function getCategoryTotalsForWeek(
  weekKey: string
): Promise<CategoryTotal[]> {
  return (await getDb()).getCategoryTotalsForWeek(weekKey);
}

export async function getTransactionsByWeekAndDay(
  weekKey: string,
  date: string
): Promise<(Transaction & { category_name: string })[]> {
  return (await getDb()).getTransactionsByWeekAndDay(weekKey, date);
}

export async function insertTransaction(params: {
  date: string;
  categoryId: number;
  amount: number;
}): Promise<number> {
  return (await getDb()).insertTransaction(params);
}

export async function insertCategory(name: string): Promise<number> {
  return (await getDb()).insertCategory(name);
}
