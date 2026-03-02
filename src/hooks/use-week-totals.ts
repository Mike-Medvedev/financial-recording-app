import { useQuery } from '@tanstack/react-query';

import { getCategoryTotalsForWeek } from '@/lib/db';
import { getWeekRange } from '@/lib/week';

import { useDb } from './use-db';

export function useWeekTotals(weekKey: string) {
  const db = useDb();
  const { start, end } = getWeekRange(weekKey);
  return useQuery({
    queryKey: ['week', weekKey],
    queryFn: () => getCategoryTotalsForWeek(db, start, end),
  });
}
