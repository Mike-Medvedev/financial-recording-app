import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/lib/db';

import { useDb } from './use-db';

export function useCategories() {
  const db = useDb();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(db),
  });
}
