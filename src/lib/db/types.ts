export interface Category {
  id: number;
  name: string;
  sort_order: number;
}

export interface Transaction {
  id: number;
  date: string;
  category_id: number;
  amount: number;
  created_at: string;
}

export interface TransactionWithCategory extends Transaction {
  category_name: string;
}

export interface CategoryTotal {
  category_id: number;
  total: number;
}
