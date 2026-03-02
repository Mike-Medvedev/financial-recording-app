import React from 'react';

import { DatabaseContext } from '@/lib/db';

export function useDb() {
  return React.use(DatabaseContext);
}
