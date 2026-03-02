import { View, Text, ActivityIndicator } from "react-native";
import { TransactionRow } from "@/components/molecules";
import { colors, spacing, typography } from "@/lib/theme";

interface TransactionItem {
  id: number;
  category_name: string;
  amount: number;
}

interface DayTransactionListProps {
  transactions: TransactionItem[];
  isLoading?: boolean;
}

export function DayTransactionList({
  transactions,
  isLoading,
}: DayTransactionListProps) {
  if (isLoading) {
    return (
      <View style={{ padding: spacing.xl, alignItems: "center" }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View
        style={{
          padding: spacing.lg,
          backgroundColor: colors.surfaceElevated,
          borderRadius: 12,
          borderCurve: "continuous",
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.textSecondary,
            textAlign: "center",
          }}
        >
          No transactions this day
        </Text>
      </View>
    );
  }

  return (
    <View>
      {transactions.map((tx) => (
        <TransactionRow
          key={tx.id}
          categoryName={tx.category_name}
          amountCents={tx.amount}
        />
      ))}
    </View>
  );
}
