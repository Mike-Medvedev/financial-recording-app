import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCategories,
  getCategoryTotalsForWeek,
  getTransactionsByWeekAndDay,
  insertCategory,
  insertTransaction,
} from "@/lib/db";
import { getWeekKey } from "@/lib/week";
export const queryKeys = {
  categories: ["categories"] as const,
  week: (weekKey: string) => ["week", weekKey] as const,
  transactions: (weekKey: string, date: string) =>
    ["transactions", weekKey, date] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
  });
}

export function useWeekTotals(weekKey: string) {
  return useQuery({
    queryKey: queryKeys.week(weekKey),
    queryFn: () => getCategoryTotalsForWeek(weekKey),
    enabled: !!weekKey,
  });
}

export function useDayTransactions(weekKey: string, date: string) {
  return useQuery({
    queryKey: queryKeys.transactions(weekKey, date),
    queryFn: () => getTransactionsByWeekAndDay(weekKey, date),
    enabled: !!weekKey && !!date,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      date: string;
      categoryId: number;
      amount: number;
    }) => insertTransaction(params),
    onSuccess: (_, variables) => {
      const txWeekKey = getWeekKey(
        new Date(variables.date + "T12:00:00.000Z")
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.week(txWeekKey) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions(txWeekKey, variables.date),
      });
    },
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => insertCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}
