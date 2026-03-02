import { Text, View } from 'react-native';

import { TransactionRow } from '@/components/molecules/transaction-row';
import { useDayTransactions } from '@/hooks/use-day-transactions';
import { useDeleteTransaction } from '@/hooks/use-delete-transaction';
import type { TransactionWithCategory } from '@/lib/db';
import { colors, spacing, typography } from '@/quarks';

interface DayTransactionListProps {
  date: string;
}

export function DayTransactionList({ date }: DayTransactionListProps) {
  const { data: transactions = [] } = useDayTransactions(date);
  const deleteMutation = useDeleteTransaction();

  if (transactions.length === 0) {
    return (
      <View
        style={{
          paddingVertical: spacing.xxl,
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
    <View style={{ gap: spacing.sm, paddingHorizontal: spacing.lg }}>
      {transactions.map((tx: TransactionWithCategory) => (
        <TransactionRow
          key={tx.id}
          categoryName={tx.category_name}
          amountCents={tx.amount}
          onDelete={() => deleteMutation.mutate({ id: tx.id, date: tx.date })}
        />
      ))}
    </View>
  );
}
