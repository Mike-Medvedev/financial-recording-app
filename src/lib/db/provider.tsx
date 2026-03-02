import { openDatabaseSync } from 'expo-sqlite';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { runMigrations } from './migrations';

import type { SQLiteDatabase } from 'expo-sqlite';

const db = openDatabaseSync('expenses.db');

export const DatabaseContext = createContext<SQLiteDatabase>(db);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    runMigrations(db).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#4a9eff" />
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
}
