import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTransaction } from '@/lib/db';
import { getWeekKey } from '@/lib/week';

import { useDb } from './use-db';

export function useDeleteTransaction() {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date }: { id: number; date: string }) => {
      await deleteTransaction(db, id);
      return { date };
    },
    onSuccess: (_data, variables) => {
      const weekKey = getWeekKey(new Date(variables.date + 'T00:00:00'));
      queryClient.invalidateQueries({ queryKey: ['week', weekKey] });
      queryClient.invalidateQueries({
        queryKey: ['transactions', weekKey, variables.date],
      });
    },
  });
}
