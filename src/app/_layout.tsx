import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router/stack';
import React from 'react';

import { DatabaseProvider } from '@/lib/db/provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0a0a0a' },
            headerTintColor: '#ffffff',
            contentStyle: { backgroundColor: '#0a0a0a' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Expenses' }} />
          <Stack.Screen
            name="keypad"
            options={{
              presentation: 'formSheet',
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.55, 0.75],
              headerShown: false,
              contentStyle: { backgroundColor: '#1a1a1a' },
            }}
          />
          <Stack.Screen
            name="add-category"
            options={{
              presentation: 'formSheet',
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.35],
              headerShown: false,
              contentStyle: { backgroundColor: '#1a1a1a' },
            }}
          />
          <Stack.Screen
            name="calendar"
            options={{
              presentation: 'formSheet',
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.6, 0.85],
              headerShown: false,
              contentStyle: { backgroundColor: '#1a1a1a' },
            }}
          />
        </Stack>
      </DatabaseProvider>
    </QueryClientProvider>
  );
}
