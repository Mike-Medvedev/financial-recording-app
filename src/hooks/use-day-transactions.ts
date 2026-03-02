import { useQuery } from '@tanstack/react-query';

import { getTransactionsForDay } from '@/lib/db';
import { getWeekKey } from '@/lib/week';

import { useDb } from './use-db';

export function useDayTransactions(date: string) {
  const db = useDb();
  const weekKey = getWeekKey(new Date(date + 'T00:00:00'));
  return useQuery({
    queryKey: ['transactions', weekKey, date],
    queryFn: () => getTransactionsForDay(db, date),
  });
}
