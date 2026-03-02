import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

import { insertTransaction } from '@/lib/db';
import { getWeekKey } from '@/lib/week';

import { useDb } from './use-db';

export function useAddTransaction() {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      categoryId,
      amount,
    }: {
      date: string;
      categoryId: number;
      amount: number;
    }) => {
      await insertTransaction(db, date, categoryId, amount);
    },
    onSuccess: (_data, variables) => {
      const weekKey = getWeekKey(new Date(variables.date + 'T00:00:00'));
      queryClient.invalidateQueries({ queryKey: ['week', weekKey] });
      queryClient.invalidateQueries({
        queryKey: ['transactions', weekKey, variables.date],
      });
      if (process.env.EXPO_OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
  });
}
