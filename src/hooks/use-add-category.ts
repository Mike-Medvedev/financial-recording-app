import { useMutation, useQueryClient } from '@tanstack/react-query';

import { insertCategory } from '@/lib/db';

import { useDb } from './use-db';

export function useAddCategory() {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await insertCategory(db, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
