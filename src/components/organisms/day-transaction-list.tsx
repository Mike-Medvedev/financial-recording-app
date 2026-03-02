import { useCallback } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { TransactionRow } from '@/components/molecules/transaction-row';
import { useDayTransactions } from '@/hooks/use-day-transactions';
import { useDeleteTransaction } from '@/hooks/use-delete-transaction';
import type { TransactionWithCategory } from '@/lib/db';
import { colors, spacing, typography } from '@/quarks';

interface DayTransactionListProps {
  date: string;
  bottomInset?: number;
}

export function DayTransactionList({
  date,
  bottomInset = 0,
}: DayTransactionListProps) {
  const { data: transactions = [] } = useDayTransactions(date);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = useCallback(
    (tx: TransactionWithCategory) => {
      Alert.alert(
        'Delete Transaction',
        `Remove $${(tx.amount / 100).toFixed(2)} from ${tx.category_name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteMutation.mutate({ id: tx.id, date: tx.date }),
          },
        ]
      );
    },
    [deleteMutation]
  );

  if (transactions.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={[typography.body, { color: colors.textTertiary }]}>
          No transactions
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(tx) => String(tx.id)}
      contentContainerStyle={{
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingBottom: bottomInset + spacing.md,
      }}
      renderItem={({ item: tx }) => (
        <TransactionRow
          categoryName={tx.category_name}
          amountCents={tx.amount}
          onDelete={() => handleDelete(tx)}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
