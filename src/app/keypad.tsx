import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { Keypad } from '@/components/molecules/keypad';
import { useAddTransaction } from '@/hooks/use-add-transaction';
import { colors, spacing, typography } from '@/quarks';

export default function KeypadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
    date: string;
  }>();

  const [display, setDisplay] = useState('0');
  const addTransaction = useAddTransaction();

  const handleDigit = useCallback(
    (digit: string) => {
      setDisplay((prev) => {
        if (digit === '.') {
          if (prev.includes('.')) return prev;
          return prev + '.';
        }
        const afterDot = prev.split('.')[1];
        if (afterDot && afterDot.length >= 2) return prev;
        if (prev === '0' && digit !== '.') return digit;
        return prev + digit;
      });
    },
    []
  );

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  }, []);

  const handleSubmit = useCallback(() => {
    const dollars = parseFloat(display);
    if (isNaN(dollars) || dollars <= 0) return;
    const cents = Math.round(dollars * 100);

    addTransaction.mutate(
      {
        date: params.date!,
        categoryId: Number(params.categoryId),
        amount: cents,
      },
      {
        onSuccess: () => router.back(),
      }
    );
  }, [display, params, addTransaction, router]);

  const dollars = parseFloat(display);
  const isValid = !isNaN(dollars) && dollars > 0;

  return (
    <View
      style={{
        flex: 1,
        padding: spacing.xl,
        gap: spacing.xl,
        backgroundColor: colors.surface,
      }}
    >
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Text style={[typography.label, { color: colors.textSecondary }]}>
          {params.categoryName}
        </Text>
        <Text selectable style={[typography.amountLarge, { color: colors.text }]}>
          ${display}
        </Text>
      </View>

      <Keypad
        value={display}
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        submitDisabled={!isValid || addTransaction.isPending}
        submitLabel={addTransaction.isPending ? 'Adding...' : 'Add'}
      />
    </View>
  );
}
